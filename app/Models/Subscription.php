<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Subscription extends Model
{
       use HasFactory, HasUuids, Notifiable;
    /**
     * Route notifications for the mail channel.
     *
     * @return string
     */
    public function routeNotificationForMail($notification)
    {
        return $this->description; // El email está en 'description'
    }

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'status',
        'last_error',
        'failed_at'
    ];

    protected $casts = [
        'status' => 'boolean',
        'failed_at' => 'datetime'
    ];

    protected $appends = [
        'is_email_valid',
        'email_error_message'
    ];

    protected static array $mxCache = [];

    public function getIsEmailValidAttribute()
    {
        return empty($this->email_error_message);
    }

    public function getEmailErrorMessageAttribute()
    {
        if (!empty($this->last_error)) {
            return $this->last_error;
        }

        $email = trim($this->description ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Formato de correo no válido';
        }

        $parts = explode('@', $email);
        $domain = count($parts) === 2 ? trim(end($parts)) : null;
        if (!$domain) {
            return 'Dominio no válido';
        }

        if (!array_key_exists($domain, self::$mxCache)) {
            self::$mxCache[$domain] = @checkdnsrr($domain, 'MX');
        }

        if (!self::$mxCache[$domain]) {
            return 'Dominio falso o sin servidor de correo (MX)';
        }

        return null;
    }
}
