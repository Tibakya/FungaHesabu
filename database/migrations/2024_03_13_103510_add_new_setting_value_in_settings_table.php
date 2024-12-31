<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $setting = new Setting();
        $setting->key = 'show_app_name_in_sidebar';
        $setting->value = '1';
        $setting->save();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Setting::where('key', 'show_app_name_in_sidebar')->delete();
    }
};
