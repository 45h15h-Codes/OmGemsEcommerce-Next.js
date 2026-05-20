<?php

namespace App\Filament\Resources\Diamonds\Pages;

use App\Filament\Concerns\HandleCloudinaryUploads;
use App\Filament\Resources\Diamonds\DiamondResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDiamond extends CreateRecord
{
    use HandleCloudinaryUploads;

    protected static string $resource = DiamondResource::class;
}
