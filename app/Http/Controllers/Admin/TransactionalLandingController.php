<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\SimpleImageProcessor;
use App\Http\Controllers\BasicController;
use App\Models\Lang;
use App\Models\TransactionalLanding;
use Illuminate\Http\Request;

class TransactionalLandingController extends BasicController
{
    public $model = TransactionalLanding::class;
    public $reactView = 'Admin/TransactionalLanding';
    
    public function beforeSave(Request $request)
    {
        $data = $request->all();
        
        \Illuminate\Support\Facades\Log::info('TransactionalLanding Save Request:', $data);

        if ($request->hasFile('cta_image')) {
            $result = SimpleImageProcessor::processAndStore($request->file('cta_image'), 'transactional_landing', 5);
            if (!$result['success']) {
                throw new \Exception("Error en imagen CTA: " . $result['message']);
            }
            $data['cta_image'] = $result['filename'];
        }

        if (isset($data['stats']) && is_string($data['stats'])) {
            $data['stats'] = json_decode($data['stats'], true);
        }
        
        if (isset($data['comparison_data']) && is_string($data['comparison_data'])) {
            $data['comparison_data'] = json_decode($data['comparison_data'], true);
        }

        if (isset($data['schema_faq']) && is_string($data['schema_faq'])) {
            $data['schema_faq'] = json_decode($data['schema_faq'], true);
        }

        if (isset($data['steps']) && is_string($data['steps'])) {
            $data['steps'] = json_decode($data['steps'], true);
            foreach ($data['steps'] as $i => &$step) {
                $fileKey = "step_image_{$i}";
                if ($request->hasFile($fileKey)) {
                    \Illuminate\Support\Facades\Log::info("Processing file for step {$i}: " . $fileKey);
                    $result = SimpleImageProcessor::processAndStore($request->file($fileKey), 'transactional_landing', 5);
                    \Illuminate\Support\Facades\Log::info("Result for step {$i}:", $result);
                    if (!$result['success']) {
                        throw new \Exception("Error en imagen del paso " . ($i + 1) . ": " . $result['message']);
                    }
                    $step['image'] = $result['filename'];
                }
            }
        }
        
        \Illuminate\Support\Facades\Log::info('TransactionalLanding Final Data to Save:', $data);
        return $data;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        return $jpa;
    }

    public function setReactViewProperties(Request $request)
    {
        $currentLangId = app('current_lang_id');
        $defaultLang = Lang::where('is_default', true)->first();

        $items = TransactionalLanding::where('lang_id', $currentLangId)
            ->orWhereNull('lang_id')
            ->get();

        return [
            'items' => $items,
            'current_lang_id' => $currentLangId,
            'default_lang_id' => $defaultLang->id,
            'PROGRAMER' => env('PROGRAMER')
        ];
    }
}
