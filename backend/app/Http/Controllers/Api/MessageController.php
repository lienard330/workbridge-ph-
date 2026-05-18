<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // Roles that can communicate with each other
    private const ALLOWED_PAIRS = [
        'seeker'   => ['employer', 'admin'],
        'employer' => ['seeker', 'admin'],
        'admin'    => ['seeker', 'employer'],
    ];

    public function contacts(Request $request)
    {
        $userId = $request->user()->id;

        $contactIds = Message::where('sender_id', $userId)
            ->orWhere('recipient_id', $userId)
            ->get()
            ->flatMap(fn (Message $m) => [$m->sender_id, $m->recipient_id])
            ->unique()
            ->filter(fn ($id) => $id !== $userId)
            ->values();

        $contacts = User::whereIn('id', $contactIds)->get(['id', 'name', 'email', 'role']);

        return response()->json($contacts);
    }

    public function thread(Request $request, $otherUserId)
    {
        $user   = $request->user();
        $userId = $user->id;

        // Verify the other user exists and the role pair is allowed
        $other = User::findOrFail($otherUserId);
        $allowed = self::ALLOWED_PAIRS[$user->role] ?? [];

        if (! in_array($other->role, $allowed)) {
            return response()->json(['message' => 'You cannot view messages with this user.'], 403);
        }

        $messages = Message::where(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $userId)->where('recipient_id', $otherUserId);
        })->orWhere(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $otherUserId)->where('recipient_id', $userId);
        })->oldest()->get();

        // Mark incoming messages as read
        Message::where('sender_id', $otherUserId)
            ->where('recipient_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'body'         => 'required|string|max:2000',
        ]);

        $sender    = $request->user();
        $recipient = User::findOrFail($data['recipient_id']);

        // Prevent messaging yourself
        if ($sender->id === $recipient->id) {
            return response()->json(['message' => 'You cannot message yourself.'], 422);
        }

        // Enforce cross-role messaging only
        $allowed = self::ALLOWED_PAIRS[$sender->role] ?? [];
        if (! in_array($recipient->role, $allowed)) {
            return response()->json(['message' => 'You can only message employers or admins.'], 403);
        }

        $message = Message::create([
            'sender_id'    => $sender->id,
            'recipient_id' => $recipient->id,
            'body'         => $data['body'],
            'is_read'      => false,
        ]);

        return response()->json($message, 201);
    }

    public function unreadCount(Request $request)
    {
        $count = Message::where('recipient_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread' => $count]);
    }
}
