<?php

namespace App\Http\Controllers;

use App\Models\General;
use App\Models\LandingHome;
use Illuminate\Http\Request;

class LegalPolicyController extends BasicController
{
    public $reactView = 'LegalPolicy';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        
        // Obtener el tipo de política basado en la URL
        $path = $request->path();
        $policyType = $this->getPolicyTypeFromPath($path);
        
        // Obtener el contenido de la política correspondiente
        $policyContent = General::where('status', true)
            ->where('lang_id', $langId)
            ->where('correlative', $policyType)
            ->first();
            
        // Obtener datos de landing si existen
        $landing = LandingHome::where('correlative', 'like', 'page_legal%')
            ->where('lang_id', $langId)
            ->get();

        return [
            'policyType' => $policyType,
            'policyContent' => $policyContent,
            'landing' => $landing,
        ];
    }

    private function getPolicyTypeFromPath($path)
    {
        if (str_contains($path, 'politicas-de-privacidad')) {
            return 'privacy_policy';
        } elseif (str_contains($path, 'terminos-y-condiciones')) {
            return 'terms_conditions';
        }
        
        return 'privacy_policy'; // Default
    }
}