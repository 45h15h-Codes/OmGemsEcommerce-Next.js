<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$products = App\Models\Product::all();
foreach ($products as $p) {
    if (is_array($p->media)) {
        foreach ($p->media as $m) {
            if (is_array($m) && isset($m['type']) && $m['type'] === 'video') {
                echo "Product {$p->id} has video:\n";
                echo json_encode($m, JSON_PRETTY_PRINT) . "\n";
            }
        }
    }
}
echo "Done.\n";
