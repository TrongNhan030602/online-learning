<?php
namespace App\Http\Requests\ExamScheduleRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Course;
use App\Models\ExamSchedule;

class ExamScheduleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'room' => 'required|string|max:50',
            'exam_date_second' => 'nullable|date',
            'exam_time_second' => 'nullable|date_format:H:i',
            'exam_type' => 'required|string|max:50',
            'duration_minutes' => 'required|integer|min:30|max:300',
            'location' => 'required|string|max:255',
            'note' => 'nullable|string',
            'program_id' => 'required|exists:training_programs,id',  // Validate program_id
        ];
    }

    public function messages()
    {
        return [
            'course_id.required' => 'Vui lòng chọn môn học.',
            'course_id.exists' => 'Môn học không tồn tại.',
            'exam_date.required' => 'Vui lòng chọn ngày thi.',
            'exam_date.date' => 'Ngày thi không hợp lệ.',
            'exam_time.required' => 'Vui lòng nhập giờ thi.',
            'exam_time.date_format' => 'Giờ thi phải theo định dạng HH:MM.',
            'room.required' => 'Vui lòng nhập phòng thi.',
            'room.max' => 'Phòng thi không được vượt quá 50 ký tự.',
            'exam_date_second.date' => 'Ngày thi lần 2 không hợp lệ.',
            'exam_time_second.date_format' => 'Giờ thi lần 2 phải theo định dạng HH:MM.',
            'exam_type.required' => 'Vui lòng chọn hình thức thi.',
            'exam_type.max' => 'Hình thức thi không được vượt quá 50 ký tự.',
            'duration_minutes.required' => 'Vui lòng nhập thời gian làm bài.',
            'duration_minutes.integer' => 'Thời gian làm bài phải là số nguyên.',
            'duration_minutes.min' => 'Thời gian làm bài tối thiểu là 30 phút.',
            'duration_minutes.max' => 'Thời gian làm bài tối đa là 300 phút.',
            'location.required' => 'Vui lòng nhập địa điểm thi.',
            'location.max' => 'Địa điểm thi không được vượt quá 255 ký tự.',
            'program_id.required' => 'Vui lòng chọn chương trình đào tạo.',
            'program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'note.string' => 'Ghi chú phải là chuỗi ký tự.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function (Validator $validator) {
            $courseId = $this->input('course_id');
            $course = Course::with('trainingPrograms')->find($courseId);

            if (!$course) {
                $validator->errors()->add('course_id', 'Không tìm thấy môn học.');
                return;
            }

            $hasValidProgram = false;

            // Kiểm tra chương trình đào tạo của môn học
            foreach ($course->trainingPrograms as $program) {
                $level = $program->level;

                // Kiểm tra nếu chương trình là hợp lệ
                if (in_array($level, ['college', 'intermediate', 'certificate', 'specialized', 'software'])) {
                    $hasValidProgram = true;
                    break; // Chỉ cần có một chương trình hợp lệ
                }
            }

            // Kiểm tra nếu môn học không thuộc chương trình hợp lệ
            if (!$hasValidProgram) {
                $validator->errors()->add('course_id', 'Môn học này không thuộc bất kỳ chương trình đào tạo hợp lệ nào.');
            }
        });
    }
}