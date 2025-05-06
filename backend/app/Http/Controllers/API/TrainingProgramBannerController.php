<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TrainingProgramBanner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TrainingProgramBannerController extends Controller
{
    public function index($programId)
    {
        try {
            $banners = TrainingProgramBanner::where('training_program_id', $programId)->get();

            if ($banners->isEmpty()) {
                return response()->json([
                    'message' => 'Không có banner nào cho chương trình này.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách banner.',
                'data' => $banners
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validate data including 'training_program_id', 'title', 'description', and image file
            $validator = Validator::make($request->all(), [
                'training_program_id' => 'required|exists:training_programs,id', // Validate program ID
                'title' => 'required|string|max:255', // Validate title
                'description' => 'nullable|string|max:1000', // Validate description
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate image file
            ]);

            if ($validator->fails()) {
                throw new Exception("Dữ liệu không hợp lệ: " . $validator->errors()->first());
            }

            // Handle file upload
            $data = $this->handleFileUpload($request);

            // Add the training_program_id, title, and description to the data array
            $data['training_program_id'] = $request->input('training_program_id');
            $data['title'] = $request->input('title');
            $data['description'] = $request->input('description');

            // Create banner
            $banner = TrainingProgramBanner::create($data);

            return response()->json([
                'message' => 'Banner đã được tạo.',
                'data' => [
                    'id' => $banner->id,
                    'training_program_id' => $banner->training_program_id,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'image_url' => $data['image_url'] // Trả về chỉ đường dẫn ảnh
                ]
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update($id, Request $request)
    {
        try {
            $banner = TrainingProgramBanner::findOrFail($id);

            // Validate image file and optional 'training_program_id', 'title', 'description'
            $validator = Validator::make($request->all(), [
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate if image is provided
                'training_program_id' => 'nullable|exists:training_programs,id', // Validate program ID if provided
                'title' => 'nullable|string|max:255', // Validate title
                'description' => 'nullable|string|max:1000', // Validate description
            ]);

            if ($validator->fails()) {
                throw new Exception("Dữ liệu không hợp lệ: " . $validator->errors()->first());
            }

            // Handle file upload
            $data = $this->handleFileUpload($request, $banner);

            // Update the banner with new data
            if ($request->has('training_program_id')) {
                $data['training_program_id'] = $request->input('training_program_id');
            }
            if ($request->has('title')) {
                $data['title'] = $request->input('title');
            }
            if ($request->has('description')) {
                $data['description'] = $request->input('description');
            }

            // Update banner
            $banner->update($data);

            return response()->json([
                'message' => 'Banner đã được cập nhật.',
                'data' => [
                    'id' => $banner->id,
                    'training_program_id' => $banner->training_program_id,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'image_url' => $data['image_url'] // Trả về chỉ đường dẫn ảnh
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $banner = TrainingProgramBanner::findOrFail($id);

            // Xóa file cũ nếu có
            if ($banner->image_url) {
                $imagePath = str_replace('storage/', '', $banner->image_url);
                Storage::disk('public')->delete($imagePath);
            }

            $banner->delete();

            return response()->json([
                'message' => 'Banner đã được xoá.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xoá banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function handleFileUpload($request, $banner = null)
    {
        $data = [];

        if ($request->hasFile('image')) {
            // Xoá file cũ nếu có
            if ($banner && $banner->image_url) {
                $oldImagePath = str_replace('storage/', '', $banner->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }

            // Lấy thông tin ảnh
            $image = $request->file('image');
            $originalName = $image->getClientOriginalName();

            // Lưu ảnh vào thư mục 'public/training_program_banner'
            $path = $image->storeAs('training_program_banner', $originalName, 'public');

            // Trả về đường dẫn hình ảnh lưu trữ
            $data['image_url'] = 'training_program_banner/' . $originalName;
        }

        return $data;
    }
}