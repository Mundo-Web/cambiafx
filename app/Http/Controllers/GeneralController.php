<?php

namespace App\Http\Controllers;


use App\Http\Classes\dxResponse;
use App\Models\Aboutus;
use App\Models\App;
use App\Models\dxDataGrid;
use App\Models\Facility;
use App\Models\General;
use App\Models\Indicator;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Service;
use App\Models\Slider;
use App\Models\Social;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Text;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;


class GeneralController extends BasicController
{


    public function getSocials(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Social::all();
            // dump($data);
            $response->data = $data;
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

    public function getApps(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = App::where('visible', true)->orderBy('order', 'asc')->get();
            $response->data = $data;
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

    public function getLanguages(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Lang::where('status', true)->where('visible', true)->get();
            // dump($data);
            $response->data = $data;
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

    public function getBenefits(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Indicator::all();

            $response->data = $data;
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


    public function getAboutuses(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Aboutus::all();
            $data2 = General::where('lang_id', app('current_lang_id'))->get();
            //$data2 = General::where('visible', true)->where('status', true)->get();
            //  $data3 = Facility::where('visible', true)->where('status', true)->where('lang_id', app('current_lang_id'))->get();
            // dump($data);
            $response->data = ['aboutus' => $data, 'generals' => $data2]; //, 'sedes' => $data3
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

    public function getGenerals(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {

            $data = General::where('status', true)->where('lang_id', app('current_lang_id'))->get();

            $response->data = $data; //, 'sedes' => $data3
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

    public function getServices(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {

            $data = Service::where('lang_id', app('current_lang_id'))->get();

            $response->data = $data; //, 'sedes' => $data3
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

    public function getModal(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $langId = app('current_lang_id');

            $data =  LandingHome::where('correlative', 'like', 'page_services_modal')->where('lang_id', $langId)->first();

            $response->data = $data; //, 'sedes' => $data3
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

    public function getTransactionalLandings(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $langId = app('current_lang_id');
            $data = \App\Models\TransactionalLanding::where('status', true)
                ->where('lang_id', $langId)
                ->get(['url', 'name']);
            $response->data = $data;
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
}
