<?php

namespace App\Repositories;

use App\Models\ExamSchedule;
use App\Interfaces\ExamScheduleInterface;

class ExamScheduleRepository implements ExamScheduleInterface
{
    public function getAll()
    {
        return ExamSchedule::with('course')->get();
    }

    public function getById($id)
    {
        return ExamSchedule::with('course')->findOrFail($id);
    }

    public function create(array $data)
    {
        return ExamSchedule::create($data);
    }

    public function update($id, array $data)
    {
        $examSchedule = ExamSchedule::findOrFail($id);
        $examSchedule->update($data);
        return $examSchedule;
    }

    public function delete($id)
    {
        $examSchedule = ExamSchedule::findOrFail($id);
        $examSchedule->delete();
        return true;
    }
}