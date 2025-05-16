<?php
namespace App\Http\Requests\ReExamRegistrationRequest;

use Illuminate\Foundation\Http\FormRequest;

class ReExamRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'student_training_program_id' => 'required|exists:student_training_programs,id',
            'course_id' => 'required|exists:courses,id',
            'exam_schedule_id' => 'required|exists:exam_schedules,id',
            'registration_date' => 'required|date',
            'reason' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:pending,approved,rejected', // ví dụ nếu bạn có trạng thái giới hạn
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Học viên là trường bắt buộc.',
            'user_id.exists' => 'Học viên không tồn tại trong hệ thống.',
            'student_training_program_id.required' => 'Chương trình đào tạo của học viên là bắt buộc.',
            'student_training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'course_id.required' => 'Môn học là trường bắt buộc.',
            'course_id.exists' => 'Môn học không tồn tại trong hệ thống.',
            'exam_schedule_id.required' => 'Lịch thi là trường bắt buộc.',
            'exam_schedule_id.exists' => 'Lịch thi không tồn tại trong hệ thống.',
            'registration_date.required' => 'Ngày đăng ký là trường bắt buộc.',
            'registration_date.date' => 'Ngày đăng ký phải là một ngày hợp lệ.',
            'reason.string' => 'Lý do phải là một chuỗi ký tự.',
            'reason.max' => 'Lý do không được vượt quá 1000 ký tự.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ];
    }
}