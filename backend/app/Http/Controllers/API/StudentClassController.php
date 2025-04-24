<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\ClassRoom;

class StudentClassController extends Controller
{
    /**
     * ✅ Lấy danh sách lớp học mà học viên đã ghi danh
     */
    public function getMyClasses()
    {
        $user = Auth::user();

        $classes = $user->enrollments()
            ->with('classroom.course')
            ->get()
            ->pluck('classroom')
            ->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                    'start_date' => $classroom->start_date->format('Y-m-d'),
                    'end_date' => $classroom->end_date->format('Y-m-d'),
                    'status' => $classroom->status,
                    'max_students' => $classroom->max_students,
                    'current_students' => $classroom->current_students,
                    'course' => [
                        'id' => $classroom->course->id,
                        'title' => $classroom->course->title,
                        'description' => $classroom->course->description,
                        'image_url' => $classroom->course->image_url,
                        'price' => $classroom->course->price,
                    ]
                ];
            });

        return response()->json([
            'status' => true,
            'data' => $classes
        ]);
    }

    /**
     * ✅ Lấy danh sách buổi học + bài học kèm video + tài liệu
     */
    public function getSessionsWithLessons($classroomId)
    {
        $user = Auth::user();

        $isEnrolled = Enrollment::where('classroom_id', $classroomId)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn không có quyền truy cập lớp học này.',
            ], 403);
        }

        $classroom = ClassRoom::with([
            'sessions.lessons.documents'
        ])->findOrFail($classroomId);

        $sessions = $classroom->sessions->map(function ($session) {
            return [
                'id' => $session->id,
                'title' => $session->title,
                'date' => $session->session_date,
                'start_time' => substr($session->start_time, 0, 5),
                'end_time' => substr($session->end_time, 0, 5),
                'lessons' => $session->lessons->map(function ($lesson) {
                    return [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'content' => $lesson->content,
                        'video_url' => $lesson->video_url,
                        'documents' => $lesson->documents->map(function ($doc) {
                            return [
                                'file_path' => '/' . ltrim($doc->file_path, '/'), // chính là dòng này
                                'file_type' => $doc->file_type,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $sessions,
        ]);
    }


}