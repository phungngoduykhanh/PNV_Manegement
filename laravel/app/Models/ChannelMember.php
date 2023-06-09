<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChannelMember extends Model
{
    use HasFactory;
    protected $table = 'channelmembers';
    
    protected $fillable = [
        'channel_id',
        'user_id'
    ];
}
