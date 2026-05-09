<?php

namespace App\Filament\Resources\Diamonds\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class DiamondForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('certificate_number')
                    ->required(),
                Select::make('lab')
                    ->options([
                        'GIA' => 'GIA',
                        'IGI' => 'IGI',
                        'GCAL' => 'GCAL',
                        'AGS' => 'AGS',
                        'HRD' => 'HRD',
                        'VGL' => 'VGL',
                    ])
                    ->required()
                    ->default('GIA'),
                TextInput::make('carat')
                    ->required()
                    ->numeric(),
                Select::make('color')
                    ->options([
                        'D' => 'D',
                        'E' => 'E',
                        'F' => 'F',
                        'G' => 'G',
                        'H' => 'H',
                        'I' => 'I',
                        'J' => 'J',
                        'K' => 'K',
                    ])
                    ->required(),
                Select::make('clarity')
                    ->options([
                        'FL' => 'FL',
                        'IF' => 'IF',
                        'VVS1' => 'VVS1',
                        'VVS2' => 'VVS2',
                        'VS1' => 'VS1',
                        'VS2' => 'VS2',
                        'SI1' => 'SI1',
                        'SI2' => 'SI2',
                    ])
                    ->required(),
                Select::make('cut')
                    ->options([
                        'Excellent' => 'Excellent',
                        'Very Good' => 'Very Good',
                        'Good' => 'Good',
                        'Fair' => 'Fair',
                        'Poor' => 'Poor',
                    ]),
                Select::make('shape')
                    ->options([
                        'Round' => 'Round',
                        'Princess' => 'Princess',
                        'Cushion' => 'Cushion',
                        'Emerald' => 'Emerald',
                        'Oval' => 'Oval',
                        'Pear' => 'Pear',
                        'Radiant' => 'Radiant',
                        'Asscher' => 'Asscher',
                        'Marquise' => 'Marquise',
                        'Heart' => 'Heart',
                    ])
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('specs'),
                TextInput::make('video_url')
                    ->url(),
                FileUpload::make('image_urls')
                    ->label('Diamond images')
                    ->disk('public')
                    ->directory('diamonds')
                    ->image()
                    ->multiple()
                    ->reorderable()
                    ->appendFiles()
                    ->columnSpanFull(),
                Toggle::make('is_available')
                    ->required(),
                TextInput::make('vendor_id')
                    ->numeric(),
            ]);
    }
}
