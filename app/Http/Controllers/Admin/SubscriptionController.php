<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Subscription;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;
class SubscriptionController extends BasicController
{
   public $model = Subscription::class;
   public $reactView = 'Admin/Subscriptions';

   public function paginate(Request $request): HttpResponse|ResponseFactory
   {
      if ($request->has('filter')) {
         $filter = $request->filter;
         if (is_string($filter)) {
            $decoded = json_decode($filter, true);
            if (is_array($decoded)) {
               $filter = $decoded;
            }
         }
         if (is_array($filter)) {
            $transformed = $this->transformEmailFilter($filter);
            $request->merge(['filter' => $transformed]);
         }
      }

      if ($request->has('sort')) {
         $sort = $request->sort;
         if (is_string($sort)) {
            $decoded = json_decode($sort, true);
            if (is_array($decoded)) {
               $sort = $decoded;
            }
         }
         if (is_array($sort)) {
            foreach ($sort as &$s) {
               if (isset($s['selector']) && $s['selector'] === 'is_email_valid') {
                  $s['selector'] = 'last_error';
               }
            }
            $request->merge(['sort' => $sort]);
         }
      }

      return parent::paginate($request);
   }

   private function transformEmailFilter(array $filter): array
   {
      if (isset($filter[0]) && is_string($filter[0]) && $filter[0] === 'is_email_valid') {
         $val = isset($filter[2]) ? filter_var($filter[2], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) : null;
         if ($val === true) {
            return ['last_error', '=', null];
         } elseif ($val === false) {
            return ['last_error', '<>', null];
         }
         return ['id', '<>', null];
      }

      foreach ($filter as $key => $item) {
         if (is_array($item)) {
            $filter[$key] = $this->transformEmailFilter($item);
         }
      }

      return $filter;
   }

   public function delete(Request $request, string $id)
   {
      $response = new Response();
      try {
         $deleted = $this->model::where('id', $id)
            ->delete();

         if (!$deleted) throw new Exception('No se ha eliminado ningun registro');

         $response->status = 200;
         $response->message = 'Operacion correcta';
      } catch (\Throwable $th) {
         $response->status = 400;
         $response->message = $th->getMessage();
      } finally {
         return response(
            $response->toArray(),
            $response->status
         );
      }
   }

   public function import(Request $request)
   {
      $response = new Response();
      try {
         $items = $request->input('items', []);
         if (empty($items)) {
            throw new Exception('No se enviaron datos para importar');
         }

         $imported = 0;
         $updated = 0;

         foreach ($items as $item) {
            $email = trim($item['description'] ?? '');
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
               continue;
            }

            $name = trim($item['name'] ?? '');
            if (empty($name)) {
               $name = \SoDe\Extend\Text::getEmailProvider($email);
            }

            $subscription = $this->model::where('description', $email)->first();
            if ($subscription) {
               $subscription->update([
                  'name' => $name,
                  'status' => true
               ]);
               $updated++;
            } else {
               $this->model::create([
                  'name' => $name,
                  'description' => $email,
                  'status' => true
               ]);
               $imported++;
            }
         }

         $response->status = 200;
         $response->message = "Importación completada: {$imported} nuevos suscriptores agregados, {$updated} actualizados.";
      } catch (\Throwable $th) {
         $response->status = 400;
         $response->message = $th->getMessage();
      } finally {
         return response(
            $response->toArray(),
            $response->status
         );
      }
   }

   public function analyzeInvalid(Request $request)
   {
      $response = new Response();
      try {
         // Consulta ultra-rápida en base de datos (se ejecuta en milisegundos sin congelar Cloudflare)
         // 1. Correos que fallaron en el envío o fueron detectados con dominio/error
         $failedSendQuery = Subscription::whereNotNull('last_error');
         $failedSendCount = $failedSendQuery->count();

         // 2. Correos con sintaxis inválida (sin @, sin punto, espacios o caracteres corruptos)
         $invalidFormatQuery = Subscription::where(function ($q) {
            $q->whereNull('description')
              ->orWhere('description', '')
              ->orWhereRaw("description NOT LIKE '%@%.%'")
              ->orWhereRaw("description LIKE '% %'")
              ->orWhereRaw("description NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'");
         })->whereNull('last_error');

         $invalidFormatCount = (clone $invalidFormatQuery)->count();

         $totalProblematic = $failedSendCount + $invalidFormatCount;
         $totalActive = Subscription::where('status', true)->count();
         $totalInactive = Subscription::where('status', false)->count();

         // Muestras de correos problemáticos (máximo 15 para visualizar en el modal)
         $invalidSamples = Subscription::where(function ($q) {
            $q->whereNotNull('last_error')
              ->orWhereNull('description')
              ->orWhere('description', '')
              ->orWhereRaw("description NOT LIKE '%@%.%'")
              ->orWhereRaw("description LIKE '% %'")
              ->orWhereRaw("description NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'");
         })
         ->limit(15)
         ->pluck('description')
         ->filter()
         ->values()
         ->toArray();

         $response->status = 200;
         $response->message = 'Análisis completado';
         $response->data = [
            'failed_send_count' => $failedSendCount,
            'invalid_format_count' => $invalidFormatCount,
            'total_problematic' => $totalProblematic,
            'total_active' => $totalActive,
            'total_inactive' => $totalInactive,
            'invalid_samples' => $invalidSamples,
         ];
      } catch (\Throwable $th) {
         $response->status = 400;
         $response->message = $th->getMessage();
      } finally {
         return response($response->toArray(), $response->status);
      }
   }

   public function cleanFailed(Request $request)
   {
      $response = new Response();
      try {
         $action = $request->input('action', 'deactivate'); // 'deactivate' o 'delete'

         $query = Subscription::where(function ($q) {
            $q->whereNotNull('last_error')
              ->orWhereNull('description')
              ->orWhere('description', '')
              ->orWhereRaw("description NOT LIKE '%@%.%'")
              ->orWhereRaw("description LIKE '% %'")
              ->orWhereRaw("description NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'");
         });

         $count = (clone $query)->count();

         if ($count === 0) {
            $response->status = 200;
            $response->message = 'No se encontraron correos fallidos o inválidos para procesar.';
            return;
         }

         if ($action === 'delete') {
            $query->delete();
            $msg = "Se eliminaron {$count} suscriptores con envíos fallidos o formato inválido.";
         } else {
            $query->update([
               'status' => false,
               'last_error' => \Illuminate\Support\Facades\DB::raw("COALESCE(last_error, 'Formato de correo o dominio no válido')"),
               'failed_at' => \Carbon\Carbon::now(),
            ]);
            $msg = "Se desactivaron {$count} suscriptores con envíos fallidos o formato inválido.";
         }

         $response->status = 200;
         $response->message = $msg;
      } catch (\Throwable $th) {
         $response->status = 400;
         $response->message = $th->getMessage();
      } finally {
         return response($response->toArray(), $response->status);
      }
   }
}
