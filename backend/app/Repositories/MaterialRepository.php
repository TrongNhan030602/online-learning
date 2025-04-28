<?php
namespace App\Repositories;

use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\MaterialRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MaterialRepository implements MaterialRepositoryInterface
{
    public function getAllMaterialsByLessonId(int $lessonId)
    {
        return Material::where('lesson_id', $lessonId)->get();
    }

    public function getMaterialById($id)
    {
        return Material::find($id);
    }

    public function createMaterial(array $data)
    {
        return Material::create($data);
    }

    public function updateMaterial(int $id, array $data)
    {
        $material = $this->getMaterialById($id);

        if (!$material) {
            throw new ModelNotFoundException('Tài liệu không tồn tại.');
        }

        $material->update($data);
        return $material;
    }

    public function deleteMaterial(int $id)
    {
        $material = $this->getMaterialById($id);

        if (!$material) {
            throw new ModelNotFoundException('Tài liệu không tồn tại.');
        }
        // Nếu là file thì xóa file vật lý
        if ($material->type === 'file' && $material->file_path) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $material->file_path));
        }
        return $material->delete();
    }
}