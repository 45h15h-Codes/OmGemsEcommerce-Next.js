<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\NavLink;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'Om Gems', 'group' => 'general'],
            ['key' => 'tagline', 'value' => 'Exquisite Luxury Diamonds', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'contact@omgems.com', 'group' => 'general'],
            ['key' => 'hero_title', 'value' => 'Discover Briliance', 'group' => 'appearance'],
            ['key' => 'primary_color', 'value' => '#d4af37', 'group' => 'appearance'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        $links = [
            ['label' => 'Diamonds', 'url' => '/diamonds', 'location' => 'header', 'order_index' => 0],
            ['label' => 'Jewelry', 'url' => '/jewelry', 'location' => 'header', 'order_index' => 1],
            ['label' => 'About Us', 'url' => '/about', 'location' => 'header', 'order_index' => 2],
            ['label' => 'Contact', 'url' => '/contact', 'location' => 'header', 'order_index' => 3],
            ['label' => 'Privacy Policy', 'url' => '/privacy', 'location' => 'footer', 'order_index' => 0],
            ['label' => 'Terms of Service', 'url' => '/terms', 'location' => 'footer', 'order_index' => 1],
        ];

        foreach ($links as $link) {
            NavLink::updateOrCreate(['label' => $link['label'], 'location' => $link['location']], $link);
        }
    }
}
