<?php

namespace App\Filament\Resources\Diamonds\Schemas;

use App\Services\CloudinaryService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
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
                        'GIA'  => 'GIA',
                        'IGI'  => 'IGI',
                        'GCAL' => 'GCAL',
                        'AGS'  => 'AGS',
                        'HRD'  => 'HRD',
                        'VGL'  => 'VGL',
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
                        'FL'   => 'FL',
                        'IF'   => 'IF',
                        'VVS1' => 'VVS1',
                        'VVS2' => 'VVS2',
                        'VS1'  => 'VS1',
                        'VS2'  => 'VS2',
                        'SI1'  => 'SI1',
                        'SI2'  => 'SI2',
                    ])
                    ->required(),
                Select::make('cut')
                    ->options([
                        'Excellent'  => 'Excellent',
                        'Very Good'  => 'Very Good',
                        'Good'       => 'Good',
                        'Fair'       => 'Fair',
                        'Poor'       => 'Poor',
                    ]),
                Select::make('shape')
                    ->options([
                        'Round'     => 'Round',
                        'Princess'  => 'Princess',
                        'Cushion'   => 'Cushion',
                        'Emerald'   => 'Emerald',
                        'Oval'      => 'Oval',
                        'Pear'      => 'Pear',
                        'Radiant'   => 'Radiant',
                        'Asscher'   => 'Asscher',
                        'Marquise'  => 'Marquise',
                        'Heart'     => 'Heart',
                    ])
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('specs'),
                TextInput::make('video_url')
                    ->url()
                    ->label('Video URL (optional override)'),

                // ── Cloudinary Media Upload ──────────────────────────────────────
                Section::make('Media — Images & Videos (Cloudinary)')
                    ->description('Upload images and/or videos. All files are stored on Cloudinary and the URLs are saved automatically.')
                    ->schema([
                        FileUpload::make('_cloudinary_images_upload')
                            ->label('Diamond Images')
                            ->disk('public')
                            ->directory('tmp-cloudinary')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                            ->helperText('JPEG, PNG, WEBP or GIF. Will be uploaded to Cloudinary on save.')
                            ->columnSpanFull(),

                        FileUpload::make('_cloudinary_videos_upload')
                            ->label('Diamond Videos')
                            ->disk('public')
                            ->directory('tmp-cloudinary')
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            // PHP's finfo can report mp4 files as video/x-m4v, video/mp4, or video/quicktime.
                            // We include all common aliases so validation passes regardless of detection.
                            ->acceptedFileTypes([
                                'video/mp4', 'video/x-m4v', 'video/webm', 'video/ogg',
                                'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
                            ])
                            ->rules(['mimetypes:video/mp4,video/x-m4v,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska'])
                            ->helperText('MP4, WEBM, MOV, AVI or MKV. Will be uploaded to Cloudinary on save.')
                            ->columnSpanFull(),

                        TextInput::make('image_urls')
                            ->label('Cloudinary Image URLs (auto-filled)')
                            ->disabled()
                            ->dehydrated()
                            ->helperText('Populated automatically from uploaded images.'),

                        TextInput::make('image_url')
                            ->label('Primary Cloudinary Image URL (auto-filled)')
                            ->disabled()
                            ->dehydrated(),
                    ])
                    ->columnSpanFull(),
                // ─────────────────────────────────────────────────────────────────

                Toggle::make('is_available')
                    ->required(),
                TextInput::make('vendor_id')
                    ->numeric(),
            ]);
    }
}
