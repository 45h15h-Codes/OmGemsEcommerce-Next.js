<?php

namespace App\Filament\Resources\Quotes\Pages;

use App\Filament\Resources\Quotes\QuoteResource;
use App\Models\Quote;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewQuote extends ViewRecord
{
    protected static string $resource = QuoteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // ── Mark as Reviewing ─────────────────────────────
            Action::make('mark_reviewing')
                ->label('Mark as Reviewing')
                ->icon('heroicon-o-eye')
                ->color('warning')
                ->visible(fn (Quote $record) => $record->status === 'pending')
                ->requiresConfirmation()
                ->modalHeading('Mark quote as reviewing?')
                ->modalDescription('This will indicate that the quote is currently being reviewed.')
                ->action(function (Quote $record): void {
                    $record->update([
                        'status' => 'reviewing',
                    ]);

                    Notification::make()
                        ->title('Quote marked as reviewing')
                        ->success()
                        ->send();
                }),

            // ── Send Quote ─────────────────────────────
            Action::make('send_quote')
                ->label('Send Quote')
                ->icon('heroicon-o-paper-airplane')
                ->color('success')
                ->visible(fn (Quote $record) => $record->status === 'reviewing')
                ->form([
                    TextInput::make('total_estimate')
                        ->label('Quote Amount (USD)')
                        ->numeric()
                        ->prefix('$')
                        ->required(),
                    Textarea::make('admin_notes')
                        ->label('Notes for Customer')
                        ->rows(3),
                ])
                ->requiresConfirmation()
                ->modalHeading('Send quote to customer?')
                ->action(function (Quote $record, array $data): void {
                    $record->update([
                        'status'         => 'quoted',
                        'total_estimate' => $data['total_estimate'],
                        'admin_notes'    => $data['admin_notes'] ?? null,
                        'quoted_at'      => now(),
                    ]);

                    Notification::make()
                        ->title('Quote sent successfully')
                        ->success()
                        ->send();
                }),

            // ── Accept Quote ─────────────────────────────
            Action::make('accept_quote')
                ->label('Accept')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->visible(fn (Quote $record) => $record->status === 'quoted')
                ->requiresConfirmation()
                ->modalHeading('Accept this quote?')
                ->action(function (Quote $record): void {
                    $record->update([
                        'status' => 'accepted',
                    ]);

                    Notification::make()
                        ->title('Quote accepted')
                        ->success()
                        ->send();
                }),

            // ── Decline Quote ──────────────────────────────
            Action::make('decline_quote')
                ->label('Decline')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(fn (Quote $record) => $record->status === 'quoted')
                ->requiresConfirmation()
                ->modalHeading('Decline this quote?')
                ->action(function (Quote $record): void {
                    $record->update([
                        'status' => 'declined',
                    ]);

                    Notification::make()
                        ->title('Quote declined')
                        ->warning()
                        ->send();
                }),

            // ── Add Internal Note ─────────────────────────
            Action::make('add_note')
                ->label('Add Note')
                ->icon('heroicon-o-pencil-square')
                ->color('gray')
                ->form([
                    Textarea::make('note')
                        ->label('Internal Note')
                        ->required()
                        ->rows(4),
                ])
                ->action(function (Quote $record, array $data): void {
                    $existing = $record->admin_notes ? $record->admin_notes . "\n\n" : '';
                    $record->update([
                        'admin_notes' => $existing . now()->format('d M Y H:i') . ': ' . $data['note'],
                    ]);

                    Notification::make()
                        ->title('Note added')
                        ->success()
                        ->send();
                }),
        ];
    }
}
