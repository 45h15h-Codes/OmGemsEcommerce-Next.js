<?php

namespace App\Filament\Resources\Diamonds\Pages;

use App\Filament\Resources\Diamonds\DiamondResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDiamonds extends ListRecords
{
    protected static string $resource = DiamondResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
