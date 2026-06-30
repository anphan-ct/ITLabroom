# Quy tắc làm việc cho Roo Code trong dự án IT Lab Room

## Tổng quan dự án
- Backend là Laravel MVC, chạy trong Docker.
- Cache dùng Redis.
- Database chính là MySQL.
- Realtime dùng Soketi.
- API phải thiết kế theo chuẩn RESTful.
- Code phải tuân thủ PSR-12.
- Ưu tiên tốc độ, độ chính xác và tối ưu truy vấn.

## Quy tắc bắt buộc trước khi code
- Luôn tự dùng tools để đọc file, dò đường dẫn, grep/search codebase và kiểm tra context liên quan trước khi sửa.
- Trước khi làm API mới hoặc chỉnh API phải kiểm tra đủ: Model, Resource, Route, Controller method, Policy nếu có, Service/Repository nếu có, migration/schema liên quan.
- Chỉ sửa đúng các file liên quan đến chức năng được yêu cầu, không đụng vào file Docker hoặc phần không liên quan nếu không được yêu cầu.
- Khi sửa một chức năng phải xem lại các phần liên quan để tránh lỗi dây chuyền.
- Khi code xong phải chạy kiểm tra phù hợp trong Docker nếu cần.

## Chuẩn response API
- Tất cả API phải trả về JSON theo đúng thứ tự key:
  `status`, `message`, `error_code`, `data`
- Luôn truyền HTTP status code ở tham số cuối của response.
- Ưu tiên dùng helper có sẵn:
  `ApiResponse::responseJson($status, $message, $errorCode, $data, $httpCode)`
- Nếu helper trong project đang đặt tên khác, phải đọc file helper trước và import đúng namespace/class.
- API phải luôn trả dữ liệu thông qua API Resource. Nếu chưa có Resource phù hợp thì tạo Resource.
- API danh sách/index phải tối ưu payload và phân trang khi phù hợp.
- API chi tiết/show dùng Resource chi tiết khi cần đầy đủ dữ liệu hơn.

## Quy tắc Controller
<!-- - Validate ngay đầu mỗi function bằng `$request->validate([...])`.
- Không tạo FormRequest riêng trừ khi người dùng yêu cầu rõ. -->
- Sử dụng Form Request trong `app/Http/Requests` cho tất cả API cần validate dữ liệu.
- Không sử dụng `$request->validate()` trực tiếp trong Controller.
- Controller chỉ xử lý nghiệp vụ sau khi dữ liệu đã được validate.
- Sử dụng `$request->validated()` để lấy dữ liệu hợp lệ.
- Dùng một khối `try-catch` lớn bao quanh logic chính trong mỗi function.
- Business logic viết trực tiếp trong function Controller theo yêu cầu dự án.
- Dùng Eloquent Model trực tiếp hoặc Query Builder.
- Bắt buộc dùng `with()`/`load()`/`withCount()` khi cần để tránh N+1 query.
- Query phải tối ưu, select field cần thiết khi phù hợp, tránh load dữ liệu thừa.
- Comment code bằng tiếng Việt khi thêm/chỉnh logic.

## Quy tắc database và transaction
- Khi thay đổi DB phải cân nhắc `nullable`, `default`, index, foreign key để migration không lỗi.
- Index/FK phải đặt tên rõ ràng, rollback được, tránh thay đổi gây lock nặng không cần thiết.
- Dùng transaction khi có nhiều thao tác ghi liên quan hoặc cần đảm bảo tính nhất quán.
- Luôn xử lý các rủi ro: race condition, double spending, overselling, distributed transaction failure, cache stampede, negative quantity, sai lệch làm tròn số, price manipulation, N+1 query.
- Với thao tác tồn kho/số lượng/trạng thái quan trọng phải cân nhắc lock row, điều kiện update nguyên tử hoặc transaction phù hợp.

## Queues và xử lý nền
- Mọi logic phức tạp, nặng, gửi mail, broadcast, đồng bộ ngoài hệ thống hoặc xử lý lâu phải đẩy vào Queue.
- Không chạy đồng bộ các tác vụ nặng trong request lifecycle.
- Khi dispatch job cần chọn queue phù hợp nếu project đã có quy ước queue.



## Models và relationships
- Khi tạo hoặc chỉnh model phải quét các model liên quan.
- Thiết lập relationship chặt chẽ, đúng tên bảng/key.
- Relationship phải hỗ trợ eager loading để tránh N+1 query.

## Routes và API Resources
- Route thêm vào `routes/api.php` theo chuẩn RESTful.
- Khi chỉnh route/API phải comment tiếng Việt nếu cần làm rõ nhóm chức năng.
- Controller phải import đúng namespace/class.
- Resource phải đặt trong `app/Http/Resources` và chỉ expose field cần thiết.

## Sau khi hoàn tất
- Chạy kiểm tra syntax/test phù hợp nếu có thể.
- Nếu cần chạy lệnh trong Docker thì tự kiểm tra đúng container/service hiện có trước khi chạy.
- Báo cáo rõ đã sửa những file nào và đã kiểm tra gì.
