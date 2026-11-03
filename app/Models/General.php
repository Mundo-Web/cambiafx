<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use App\Traits\ClearsPublicCache;

class General extends Model
{
    use HasFactory, HasUuids, ClearsPublicCache;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'correlative',
        'description',
        'status',
        'lang_id',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }

    public static function rules(): array
    {
        return [
            'correlative' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'lang_id' => 'required|exists:langs,id',
            // Regla de unicidad compuesta
            Rule::unique('generals')->where(function ($query) {
                return $query->where('lang_id', request('lang_id'));
            })->ignore(request('id'))
        ];
    }
}
