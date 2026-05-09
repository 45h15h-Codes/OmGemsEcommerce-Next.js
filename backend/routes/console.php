<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Diamond;
use App\Services\DiamondCatalogSyncService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('diamonds:sync-catalog', function (DiamondCatalogSyncService $sync) {
    $count = 0;

    Diamond::query()->orderBy('id')->each(function (Diamond $diamond) use ($sync, &$count) {
        $sync->sync($diamond);
        $count++;
    });

    $this->info("Synced {$count} diamonds into the storefront catalog.");
})->purpose('Backfill legacy diamonds into catalog products for storefront listing pages');
