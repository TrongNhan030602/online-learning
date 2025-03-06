<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\CourseFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseFileController extends Controller
{
    // Lấy danh sách file của một khóa học
    public function index($courseId)
    {
        $course = Course::findOrFail($courseId);
        return response()->json($course->files);
    }

    // Upload file mới cho một khóa học
    public function store(Request $request, $courseId)
    {
        $data = $request->validate([
            'type' => 'required|in:image,document',
            'file' => 'required|file|max:10240', // tối đa 10MB
        ]);

        $course = Course::findOrFail($courseId);

        // Xác định thư mục lưu file dựa vào type
        $directory = $data['type'] === 'image' ? 'course_images' : 'course_documents';

        // Lấy tên gốc của file
        $originalName = $request->file('file')->getClientOriginalName();
        $extension = $request->file('file')->getClientOriginalExtension();
        $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);

        // Sử dụng Str::slug để chuyển đổi tên sang dạng slug, thay thế các ký tự đặc biệt
        $slug = Str::slug($nameWithoutExt);
        // Tạo tên file mới, thêm timestamp để đảm bảo tính duy nhất
        $newName = $slug . '-' . time() . '.' . $extension;
        $filePath = $request->file('file')->storeAs($directory, $newName, 'public');

        $courseFile = CourseFile::create([
            'course_id' => $course->id,
            'type' => $data['type'],
            'file_path' => $filePath,
        ]);

        return response()->json($courseFile, 201);
    }

    // Xóa file của một khóa học
    public function destroy($courseId, $fileId)
    {
        $course = Course::findOrFail($courseId);
        $courseFile = $course->files()->findOrFail($fileId);

        // Xóa file khỏi storage
        Storage::disk('public')->delete($courseFile->file_path);

        // Xóa record trong database
        $courseFile->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}