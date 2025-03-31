<?php

namespace App\Repositories;

use App\Interfaces\ClassRoomRepositoryInterface;
use App\Models\ClassRoom;

class ClassRoomRepository implements ClassRoomRepositoryInterface
{
    public function getAll()
    {
        return ClassRoom::with('course')->get();
    }

    public function getById($id)
    {
        return ClassRoom::with(['course', 'sessions', 'students'])->find($id);
    }


    public function getByCourseId($courseId)
    {
        return ClassRoom::where('course_id', $courseId)
            ->with('course')
            ->get();
    }


    public function create(array $data)
    {
        return ClassRoom::create($data);
    }

    public function update($id, array $data)
    {
        $classRoom = ClassRoom::findOrFail($id);
        $classRoom->update($data);
        return $classRoom;
    }

    public function delete($id)
    {
        $classRoom = ClassRoom::findOrFail($id);
        return $classRoom->delete();
    }
}