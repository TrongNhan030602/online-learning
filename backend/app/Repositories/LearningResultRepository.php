<?php
namespace App\Repositories;

use App\Models\LearningResult;
use App\Interfaces\LearningResultRepositoryInterface;

class LearningResultRepository implements LearningResultRepositoryInterface
{
    public function all()
    {
        return LearningResult::all();
    }

    public function find($id)
    {
        return LearningResult::findOrFail($id);
    }

    public function create(array $data)
    {
        return LearningResult::create($data);
    }

    public function update($id, array $data)
    {
        $learningResult = LearningResult::findOrFail($id);
        $learningResult->update($data);
        return $learningResult;
    }

    public function delete($id)
    {
        $learningResult = LearningResult::findOrFail($id);
        $learningResult->delete();
    }
}