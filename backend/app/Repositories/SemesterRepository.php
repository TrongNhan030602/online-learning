<?php
namespace App\Repositories;

use App\Models\Semester;
use App\Interfaces\SemesterRepositoryInterface;

class SemesterRepository implements SemesterRepositoryInterface
{
    public function createSemester(array $data)
    {
        return Semester::create($data);
    }

    public function getAllSemesters()
    {
        return Semester::with('trainingProgram', 'courses')->get();
    }

    public function getSemesterById($id)
    {
        return Semester::with('trainingProgram', 'courses')->findOrFail($id);
    }

    public function updateSemester($id, array $data)
    {
        $semester = Semester::findOrFail($id);
        $semester->update($data);
        return $semester;
    }

    public function deleteSemester($id)
    {
        $semester = Semester::findOrFail($id);
        $semester->delete();
        return $semester;
    }

    public function addCoursesToSemester($semesterId, array $courseIds)
    {
        $semester = Semester::findOrFail($semesterId);
        $semester->courses()->sync($courseIds);
        return $semester->load('courses');
    }
}