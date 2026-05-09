<?php

namespace App\Filament\Resources\Diamonds\Pages;

use App\Filament\Resources\Diamonds\DiamondResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDiamond extends EditRecord
{
    protected static string $resource = DiamondResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
