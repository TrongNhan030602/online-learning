<?php
namespace App\Http\Controllers\API;

use App\Models\LandingSlide;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LandingSlideController extends Controller
{
    // Lấy danh sách slide
    public function index()
    {
        // Lấy danh sách slide có trạng thái hoạt động (is_active = true)
        $slides = LandingSlide::with('trainingProgram:id,name')
            ->where('is_active', true)
            ->orderBy('order')  // Sắp xếp theo thứ tự
            ->get();

        return response()->json($slides);
    }

    // Tạo mới slide (upload ảnh)
    public function store(Request $request)
    {
        $request->validate([
            'training_program_id' => 'required|exists:training_programs,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        // Lấy tên gốc của ảnh
        $originalImageName = $request->file('image')->getClientOriginalName();
        $extension = $request->file('image')->getClientOriginalExtension();
        $nameWithoutExt = pathinfo($originalImageName, PATHINFO_FILENAME);

        $slug = Str::slug($nameWithoutExt);
        $newImageName = $slug . '-' . time() . '.' . $extension;

        $imagePath = $request->file('image')->storeAs('slides', $newImageName, 'public');

        // Lưu thông tin vào cơ sở dữ liệu
        $slide = LandingSlide::create([
            'training_program_id' => $request->training_program_id,
            'image_url' => 'slides/' . $newImageName,  // Đường dẫn ảnh trong storage
            'original_image_name' => $originalImageName, // Lưu tên ảnh gốc
            'title' => $request->title,
            'description' => $request->description,
            'order' => $request->order ?? 0, // Nếu không có order thì mặc định là 0
            'is_active' => true, // Mặc định là hoạt động
        ]);

        return response()->json([
            'message' => 'Slide created successfully.',
            'slide' => $slide
        ]);
    }

    // Xoá slide
    public function destroy($id)
    {
        // Tìm slide theo ID
        $slide = LandingSlide::findOrFail($id);

        // Xoá ảnh nếu có
        if ($slide->image_url) {
            // Xóa ảnh khỏi storage
            Storage::disk('public')->delete($slide->image_url); // Xoá ảnh theo đường dẫn lưu trữ
        }

        // Xoá slide khỏi database
        $slide->delete();

        return response()->json(['message' => 'Slide deleted successfully.']);
    }
}