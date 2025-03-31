<?php
namespace App\Repositories;

use App\Models\ClassRoom;
use App\Models\Enrollment;
use App\Interfaces\EnrollmentRepositoryInterface;

class EnrollmentRepository implements EnrollmentRepositoryInterface
{

    public function enrollStudent($classroomId, $userId)
    {
        // Kiểm tra nếu học viên đã ghi danh vào lớp này chưa
        $exists = Enrollment::where('classroom_id', $classroomId)
            ->where('user_id', $userId)
            ->exists();

        if ($exists) {
            throw new \Exception("Học viên đã ghi danh vào lớp này rồi.");
        }

        // Tạo ghi danh mới và trực tiếp duyệt
        $enrollment = Enrollment::create([
            'classroom_id' => $classroomId,
            'user_id' => $userId,
            'status' => 'approved', // Đặt trạng thái là 'approved'
        ]);

        // Tìm lớp học
        $classroom = ClassRoom::find($classroomId);

        if ($classroom) {
            // Cập nhật số lượng học viên đã duyệt trong lớp
            $approvedCount = $classroom->enrollments()->where('status', 'approved')->count();

            // Cập nhật số lượng học viên đã duyệt trong lớp
            $classroom->current_students = $approvedCount;
            $classroom->save();
        }

        return $enrollment; // Trả về ghi danh mới đã duyệt
    }




    public function getEnrollmentsByClassroom($classroomId)
    {
        // Tìm lớp học cùng với thông tin khóa học và enrollments liên quan
        $classroom = ClassRoom::with(['course', 'enrollments.student.profile'])
            ->find($classroomId);

        // Nếu lớp học không tồn tại, trả về empty data cho lớp học và học viên
        if (!$classroom) {
            return [
                'classroom' => null,
                'students' => []
            ];
        }

        // Lấy khóa học từ phương thức course() để tránh cảnh báo magic method
        $course = $classroom->course; // Đây là quan hệ đã được eager load

        // Lấy danh sách học viên đã được duyệt
        $students = $classroom->enrollments()
            ->where('status', 'approved') // Chỉ lấy học viên đã được duyệt
            ->get()
            ->map(function ($enrollment) {
                $student = $enrollment->student;
                $profile = $student->profile;

                // Trả về thông tin học viên, sử dụng giá trị mặc định khi profile không có
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'phone' => $profile->phone ?? 'Chưa cập nhật',
                    'registered_at' => $student->created_at,
                    'first_name' => $profile->first_name ?? 'Chưa cập nhật',
                    'last_name' => $profile->last_name ?? 'Chưa cập nhật',
                    'address' => $profile->address ?? 'Chưa cập nhật',
                    'gender' => $profile->gender ?? 'Chưa cập nhật',
                    'position' => $profile->position ?? 'Chưa cập nhật',
                    'avatar' => $profile->avatar ?? null
                ];
            });

        // Trả về thông tin lớp học và danh sách học viên
        return [
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'course' => [
                    'id' => $course->id,
                    'title' => $course->title
                ],
                'start_date' => $classroom->start_date,
                'end_date' => $classroom->end_date,
                'status' => $classroom->status,
                'max_students' => $classroom->max_students,
                'current_students' => $classroom->enrollments()->where('status', 'approved')->count() // Đếm số học viên đã duyệt
            ],
            'students' => $students
        ];
    }











    public function getEnrollmentsByStudent($userId)
    {
        return Enrollment::where('user_id', $userId)
            ->with('classroom')
            ->get();
    }

    public function updateEnrollmentStatus($id, $status)
    {
        $validStatuses = ['pending', 'approved', 'rejected'];
        if (!in_array($status, $validStatuses)) {
            throw new \InvalidArgumentException("Trạng thái không hợp lệ.");
        }

        $enrollment = Enrollment::find($id);
        if ($enrollment) {
            $enrollment->update(['status' => $status]);
            return $enrollment;
        }
        return null;
    }

    public function removeEnrollment($id)
    {
        // Tìm ghi danh cần xóa
        $enrollment = Enrollment::find($id);

        if (!$enrollment) {
            throw new \Exception("Ghi danh không tồn tại.");
        }
        $classroom = $enrollment->classroom()->first();

        // Xóa ghi danh
        $deleted = $enrollment->delete();

        // Cập nhật lại số lượng học viên đã duyệt trong lớp
        if ($classroom) {
            $classroom->current_students = Enrollment::where('classroom_id', $classroom->id)
                ->where('status', 'approved')
                ->count(); // Cập nhật lại số học viên đã duyệt
            $classroom->save();
        }

        return $deleted; // Trả về kết quả xóa ghi danh
    }


}