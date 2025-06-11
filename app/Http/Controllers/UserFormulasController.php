<?php

namespace App\Http\Controllers;

use App\Models\UserFormulas;
use App\Http\Requests\StoreUserFormulasRequest;
use App\Http\Requests\UpdateUserFormulasRequest;
use App\Models\Formula;
use App\Models\FormulaHasSupply;
use App\Models\Subscription;
use App\Models\Supply;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SoDe\Extend\Text;

class UserFormulasController extends BasicController
{
    public $model = UserFormulas::class;

    public function beforeSave(Request $request)
    {
        $request->validate([
            'has_treatment' => 'required|string|min:36|max:36',
            'scalp_type' => 'required|string|min:36|max:36',
            'hair_type' => 'required|string|min:36|max:36',
            'hair_goals' => 'required|array',
            'email' => 'required|string|email|max:255',
        ]);

        $body = $request->all();
        $body['fragrance_id'] = $body['fragrance'];

        $jpa = UserFormulas::select()
            ->where('has_treatment', $body['has_treatment'])
            ->where('scalp_type', $body['scalp_type'])
            ->where('hair_type', $body['hair_type'])
            ->whereRaw('JSON_CONTAINS(hair_goals, ?)', [json_encode($body['hair_goals'])])
            ->where('fragrance_id', $body['fragrance_id'])
            ->where('email', $body['email'])
            ->first();
        if ($jpa) $body['id'] = $jpa->id;

        $userJpa = User::where('email', $body['email'])->first();

        if (Auth::check()) {
            $body['user_id'] = Auth::user()->id;
        } else if ($userJpa) {
            $body['user_id'] = $userJpa->id;
        }

        return $body;
    }
    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        try {
            Subscription::updateOrCreate([
                'description' => $jpa->email
            ], [
                'name' => Text::getEmailProvider($jpa->email),
            ]);
        } catch (\Throwable $th) {
        }
        if ($isNew) {
            try {
                $userFormulaJpa = UserFormulas::with([
                    'hasTreatment',
                    'scalpType',
                    'hairType',
                    'fragrance',
                    'user'
                ])->find($jpa->id);

                $hairGoalsJpa = Formula::whereIn('id', $userFormulaJpa->hair_goals)->get();

                $formulaIds = array_merge(
                    $userFormulaJpa->hair_goals,
                    [
                        $userFormulaJpa->has_treatment,
                        $userFormulaJpa->scalp_type,
                        $userFormulaJpa->hair_type,
                    ]
                );

                $fhsJpa = FormulaHasSupply::select('supply_id')
                    ->whereIn('formula_id', $formulaIds)
                    ->get();

                $suppliesJpa = Supply::select()
                    ->whereIn('id', array_map(fn($item) => $item['supply_id'], $fhsJpa->toArray()))
                    ->get();

                MailingController::simpleNotify('mailing.new-formula', $jpa->email, [
                    'formula' => $userFormulaJpa,
                    'supplies' => $suppliesJpa,
                    'hair_goals' => $hairGoalsJpa,
                    'title' => 'Formula lista - ' . \env('APP_NAME')
                ]);
            } catch (\Throwable $th) {
            }
        }
        return $jpa;
    }
}
