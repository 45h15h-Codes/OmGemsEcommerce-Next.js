<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$diamond = App\Models\Diamond::whereNotNull('video_url')->latest()->first();
if ($diamond) {
    echo "Diamond:\n";
    echo json_encode($diamond->toArray(), JSON_PRETTY_PRINT) . "\n\n";

    $product = App\Models\Product::where('sku', 'DIA-' . $diamond->certificate_number)->first();
    echo "Product Media:\n";
    echo json_encode($product->media, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No diamond with video_url found.\n";
}
