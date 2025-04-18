<?php

namespace App\Repositories;

use Carbon\Carbon;
use App\Models\ClassRoom;
use App\Interfaces\ClassRoomRepositoryInterface;

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
        // Lấy lớp học từ ID
        $classRoom = ClassRoom::findOrFail($id);

        // Kiểm tra và chuyển đổi thời gian start_date và end_date sang UTC nếu có
        if (isset($data['start_date'])) {
            $data['start_date'] = Carbon::parse($data['start_date'])->utc();
        }

        if (isset($data['end_date'])) {
            $data['end_date'] = Carbon::parse($data['end_date'])->utc();
        }

        // Cập nhật lớp học với dữ liệu mới
        $classRoom->update($data);

        return $classRoom;
    }

    public function delete($id)
    {
        $classRoom = ClassRoom::findOrFail($id);
        return $classRoom->delete();
    }
}