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
}
