<?php

namespace App\Repositories;

use App\Interfaces\DisciplineScoreInterface;
use App\Models\DisciplineScore;

class DisciplineScoreRepository implements DisciplineScoreInterface
{
    public function getAll()
    {
        return DisciplineScore::with(['student', 'semester'])->get();
    }

    public function getById($id)
    {
        return DisciplineScore::with(['student', 'semester'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return DisciplineScore::create($data);
    }

    public function update($id, array $data)
    {
        $disciplineScore = DisciplineScore::findOrFail($id);
        $disciplineScore->update($data);
        return $disciplineScore;
    }

    public function delete($id)
    {
        $disciplineScore = DisciplineScore::findOrFail($id);
        return $disciplineScore->delete();
    }
}