// services/regulationsService.js

// Danh sách nội quy, quy định mẫu
// Key cho localStorage
const READ_STATUS_KEY = 'regulations_read_status';

const sampleRegulations = [
  {
    id: 1,
    title: 'Nội quy làm việc chung tại văn phòng',
    brief: 'Áp dụng cho tất cả nhân viên từ 15/04/2025',
    content: `
    <h3>NỘI QUY LÀM VIỆC CHUNG TẠI VĂN PHÒNG</h3>
    <p><strong>Áp dụng từ ngày 15/04/2025</strong></p>
    
    <h4>1. Giờ làm việc</h4>
    <ul>
      <li>Sáng: 8:00 - 12:00</li>
      <li>Chiều: 13:30 - 17:30</li>
      <li>Làm việc 5 ngày/tuần từ thứ 2 đến thứ 6</li>
    </ul>
    
    <h4>2. Trang phục làm việc</h4>
    <p>Tất cả nhân viên phải ăn mặc lịch sự, phù hợp với môi trường văn phòng:</p>
    <ul>
      <li>Nam: Áo sơ mi, quần tây, giày da</li>
      <li>Nữ: Trang phục công sở lịch sự</li>
      <li>Thứ 6: Có thể mặc trang phục tự do nhưng vẫn đảm bảo lịch sự</li>
    </ul>
    
    <h4>3. Quy định về vệ sinh văn phòng</h4>
    <ul>
      <li>Giữ gìn vệ sinh chung, không vứt rác bừa bãi</li>
      <li>Sắp xếp bàn làm việc gọn gàng sau giờ làm</li>
      <li>Không mang thức ăn có mùi nồng vào khu vực làm việc</li>
    </ul>
    
    <h4>4. Quy định về cuộc họp</h4>
    <ul>
      <li>Đi họp đúng giờ</li>
      <li>Tắt điện thoại hoặc để chế độ rung khi họp</li>
      <li>Chuẩn bị tài liệu đầy đủ trước cuộc họp</li>
    </ul>
    
    <p>Mọi nhân viên có trách nhiệm tuân thủ nội quy này. Trường hợp vi phạm sẽ bị nhắc nhở hoặc xử lý kỷ luật tùy mức độ.</p>
    `,
    date: '15/04/2025',
    isNew: true,
    isImportant: true,
    useHtml: true
  },
  {
    id: 2,
    title: 'Quy định về chấm công và giờ làm việc',
    brief: 'Quy định mới thay thế quy định cũ từ 01/04/2025',
    content: `
    <h3>QUY ĐỊNH VỀ CHẤM CÔNG VÀ GIỜ LÀM VIỆC</h3>
    <p><strong>Hiệu lực từ ngày 01/04/2025</strong></p>
    
    <h4>1. Hệ thống chấm công</h4>
    <ul>
      <li>Sử dụng hệ thống chấm công điện tử bằng vân tay</li>
      <li>Chấm công vào lúc: 8:00, 12:00, 13:30, 17:30</li>
      <li>Mọi vấn đề về chấm công cần báo cáo với phòng nhân sự trong vòng 24h</li>
    </ul>
    
    <h4>2. Giờ làm việc</h4>
    <ul>
      <li>Thời gian làm việc: 8 giờ/ngày, 40 giờ/tuần</li>
      <li>Nhân viên được phép đến trễ tối đa 15 phút không quá 3 lần/tháng</li>
      <li>Trễ quá 15 phút sẽ tính là đi trễ 1/2 buổi</li>
    </ul>
    
    <h4>3. Làm thêm giờ</h4>
    <ul>
      <li>Làm thêm giờ phải có sự đồng ý của quản lý trực tiếp</li>
      <li>Đăng ký làm thêm giờ trước ít nhất 24h</li>
      <li>Tối đa không quá 40 giờ làm thêm/tháng</li>
    </ul>
    
    <h4>4. Nghỉ phép</h4>
    <ul>
      <li>Đăng ký nghỉ phép trước ít nhất 3 ngày làm việc</li>
      <li>Nghỉ đột xuất phải thông báo trước 8:00 sáng</li>
      <li>Nghỉ từ 3 ngày trở lên phải có đơn xin phép gửi phòng nhân sự</li>
    </ul>
    
    <p>Quy định này thay thế quy định cũ về chấm công và giờ làm việc. Mọi thắc mắc xin liên hệ phòng nhân sự để được giải đáp.</p>
    `,
    date: '01/04/2025',
    isNew: true,
    isImportant: false,
    useHtml: true
  },
  {
    id: 3,
    title: 'Quy định về trang phục văn phòng',
    brief: 'Quy định về trang phục khi làm việc tại văn phòng',
    content: `
    <h3>QUY ĐỊNH VỀ TRANG PHỤC VĂN PHÒNG</h3>
    <p><strong>Áp dụng cho tất cả nhân viên</strong></p>
    
    <h4>1. Nguyên tắc chung</h4>
    <p>Tất cả nhân viên cần ăn mặc chỉnh tề, lịch sự, phù hợp với môi trường làm việc chuyên nghiệp.</p>
    
    <h4>2. Trang phục trong ngày làm việc thông thường</h4>
    <p><strong>Đối với nam:</strong></p>
    <ul>
      <li>Áo sơ mi dài tay hoặc ngắn tay</li>
      <li>Quần tây</li>
      <li>Giày da hoặc giày lịch sự (không mang dép lê)</li>
    </ul>
    
    <p><strong>Đối với nữ:</strong></p>
    <ul>
      <li>Áo sơ mi, áo blouse lịch sự</li>
      <li>Váy hoặc quần tây có độ dài phù hợp</li>
      <li>Giày dép lịch sự</li>
    </ul>
    
    <h4>3. Trang phục thứ Sáu (Casual Friday)</h4>
    <ul>
      <li>Áo phông lịch sự (không hình ảnh phản cảm)</li>
      <li>Quần jean hoặc quần kaki sạch sẽ, không rách</li>
      <li>Giày thể thao sạch sẽ</li>
    </ul>
    
    <h4>4. Trang phục không được phép</h4>
    <ul>
      <li>Quần short, áo ba lỗ</li>
      <li>Áo hở ngực, hở lưng, hở bụng</li>
      <li>Dép lê, dép tông</li>
      <li>Trang phục thể thao (trừ ngày thứ Sáu)</li>
    </ul>
    
    <p>Nhân viên không tuân thủ quy định về trang phục sẽ được nhắc nhở. Vi phạm nhiều lần có thể bị xử lý kỷ luật.</p>
    `,
    date: '25/03/2025',
    isNew: false,
    isImportant: false,
    useHtml: true
  },
  {
    id: 4,
    title: 'Quy trình xử lý công việc nội bộ',
    brief: 'Quy trình mới áp dụng từ tháng 3/2025',
    content: `
    <h3>QUY TRÌNH XỬ LÝ CÔNG VIỆC NỘI BỘ</h3>
    <p><strong>Hiệu lực từ 15/03/2025</strong></p>
    
    <h4>1. Tiếp nhận công việc</h4>
    <ul>
      <li>Công việc được giao qua hệ thống quản lý công việc nội bộ</li>
      <li>Thời gian phản hồi tiếp nhận: trong vòng 2 giờ làm việc</li>
      <li>Xác nhận thời gian hoàn thành dự kiến</li>
    </ul>
    
    <h4>2. Phối hợp giữa các phòng ban</h4>
    <ul>
      <li>Sử dụng biểu mẫu yêu cầu phối hợp trên hệ thống</li>
      <li>Thời gian phản hồi: trong vòng 4 giờ làm việc</li>
      <li>Mọi vấn đề phát sinh phải được thông báo cho các bên liên quan</li>
    </ul>
    
    <h4>3. Báo cáo tiến độ</h4>
    <ul>
      <li>Báo cáo tiến độ hàng ngày trước 17:00</li>
      <li>Cập nhật trạng thái công việc trên hệ thống</li>
      <li>Thông báo sớm nếu có khả năng chậm tiến độ</li>
    </ul>
    
    <h4>4. Hoàn thành và bàn giao</h4>
    <ul>
      <li>Hoàn thành công việc đúng thời hạn</li>
      <li>Lưu trữ tài liệu theo quy định</li>
      <li>Gửi email xác nhận hoàn thành cho các bên liên quan</li>
    </ul>
    
    <p>Quy trình này nhằm nâng cao hiệu quả phối hợp giữa các phòng ban và đảm bảo chất lượng công việc.</p>
    `,
    date: '15/03/2025',
    isNew: false,
    isImportant: false,
    useHtml: true
  },
  {
    id: 5,
    title: 'Quy định về chế độ nghỉ phép',
    brief: 'Quy định mới về chế độ nghỉ phép, nghỉ ốm và phúc lợi',
    content: `
    <h3>QUY ĐỊNH VỀ CHẾ ĐỘ NGHỈ PHÉP</h3>
    <p><strong>Áp dụng từ 01/03/2025</strong></p>
    
    <h4>1. Ngày phép năm</h4>
    <ul>
      <li>Nhân viên dưới 1 năm: 12 ngày/năm (tính theo tỷ lệ thời gian làm việc)</li>
      <li>Nhân viên từ 1-5 năm: 14 ngày/năm</li>
      <li>Nhân viên trên 5 năm: 16 ngày/năm</li>
      <li>Phép năm được cộng dồn tối đa 5 ngày sang năm sau</li>
    </ul>
    
    <h4>2. Quy trình xin phép</h4>
    <ul>
      <li>Đăng ký trên hệ thống ít nhất 3 ngày làm việc trước ngày nghỉ</li>
      <li>Nghỉ từ 3 ngày trở lên: phải đăng ký trước 7 ngày</li>
      <li>Nghỉ đột xuất: thông báo trước 8:00 sáng ngày nghỉ</li>
    </ul>
    
    <h4>3. Nghỉ ốm</h4>
    <ul>
      <li>Nghỉ ốm phải có xác nhận của cơ sở y tế</li>
      <li>Thông báo cho quản lý trực tiếp trong ngày đầu tiên nghỉ ốm</li>
      <li>Nộp giấy xác nhận trong vòng 3 ngày sau khi đi làm lại</li>
    </ul>
    
    <h4>4. Nghỉ không lương</h4>
    <ul>
      <li>Chỉ áp dụng khi đã sử dụng hết phép năm</li>
      <li>Đăng ký trước ít nhất 14 ngày</li>
      <li>Phải được sự phê duyệt của Trưởng phòng và Giám đốc nhân sự</li>
    </ul>
    
    <p>Quy định này thay thế tất cả các quy định trước đây về chế độ nghỉ phép. Mọi thắc mắc xin liên hệ phòng nhân sự.</p>
    `,
    date: '01/03/2025',
    isNew: false,
    isImportant: true,
    useHtml: true
  },
  {
    id: 6,
    title: 'Quy định về bảo mật thông tin',
    brief: 'Quy định về bảo mật thông tin và dữ liệu trong công ty',
    content: `
    <h3>QUY ĐỊNH VỀ BẢO MẬT THÔNG TIN</h3>
    <p><strong>Áp dụng cho tất cả nhân viên</strong></p>
    
    <h4>1. Phạm vi áp dụng</h4>
    <p>Tất cả thông tin, dữ liệu, tài liệu nội bộ của công ty đều thuộc diện bảo mật và cần được bảo vệ.</p>
    
    <h4>2. Phân loại thông tin</h4>
    <ul>
      <li><strong>Mật:</strong> Thông tin kinh doanh, tài chính, chiến lược phát triển</li>
      <li><strong>Tối mật:</strong> Bí quyết công nghệ, thông tin khách hàng, hợp đồng quan trọng</li>
      <li><strong>Thông thường:</strong> Thông tin vận hành hàng ngày, quy trình công việc</li>
    </ul>
    
    <h4>3. Trách nhiệm bảo mật</h4>
    <ul>
      <li>Không chia sẻ thông tin với bên ngoài khi chưa được phép</li>
      <li>Không sử dụng thông tin công ty cho mục đích cá nhân</li>
      <li>Bảo vệ mật khẩu và không chia sẻ tài khoản</li>
      <li>Khóa máy tính khi rời khỏi vị trí làm việc</li>
    </ul>
    
    <h4>4. Xử lý vi phạm</h4>
    <ul>
      <li>Vi phạm nhẹ: Nhắc nhở, cảnh cáo</li>
      <li>Vi phạm nghiêm trọng: Kỷ luật, chấm dứt hợp đồng</li>
      <li>Gây thiệt hại: Bồi thường và có thể bị truy cứu trách nhiệm pháp lý</li>
    </ul>
    
    <p>Quy định này có hiệu lực kể từ ngày ký và là một phần không thể tách rời của hợp đồng lao động.</p>
    `,
    date: '15/02/2025',
    isNew: false,
    isImportant: true,
    useHtml: true
  },
  {
    id: 7,
    title: 'Quy định về sử dụng tài sản công ty',
    brief: 'Quy định về việc sử dụng tài sản và trang thiết bị của công ty',
    content: `
    <h3>QUY ĐỊNH VỀ SỬ DỤNG TÀI SẢN CÔNG TY</h3>
    <p><strong>Áp dụng từ ngày 01/02/2025</strong></p>
    
    <h4>1. Tài sản công ty bao gồm</h4>
    <ul>
      <li>Máy tính, laptop, điện thoại công ty cấp</li>
      <li>Thiết bị văn phòng: máy in, máy photocopy, máy scan</li>
      <li>Phương tiện đi lại: xe công ty</li>
      <li>Cơ sở vật chất: bàn ghế, tủ, không gian làm việc</li>
    </ul>
    
    <h4>2. Quy định sử dụng</h4>
    <ul>
      <li>Chỉ sử dụng tài sản công ty cho mục đích công việc</li>
      <li>Giữ gìn, bảo quản tài sản, tránh hư hỏng, mất mát</li>
      <li>Không tự ý tháo lắp, sửa chữa thiết bị</li>
      <li>Không cài đặt phần mềm trái phép trên máy tính công ty</li>
    </ul>
    
    <h4>3. Quy định mượn thiết bị</h4>
    <ul>
      <li>Phải đăng ký mượn thiết bị với phòng hành chính</li>
      <li>Thời gian mượn tối đa 3 ngày làm việc</li>
      <li>Phải hoàn trả đúng hạn và trong tình trạng tốt</li>
    </ul>
    
    <h4>4. Trách nhiệm bồi thường</h4>
    <ul>
      <li>Làm mất, hư hỏng do sử dụng sai quy cách: phải bồi thường 100% giá trị</li>
      <li>Hư hỏng do lỗi chủ quan: bồi thường theo mức độ hư hỏng</li>
      <li>Mất cắp do thiếu trách nhiệm bảo quản: bồi thường tối thiểu 70% giá trị</li>
    </ul>
    
    <p>Mọi trường hợp vi phạm quy định sử dụng tài sản công ty đều bị xử lý theo quy chế của công ty.</p>
    `,
    date: '01/02/2025',
    isNew: false,
    isImportant: false,
    useHtml: true
  }
];

export default {
  /**
   * Lấy danh sách quy định
   * @param {Object} params - Tham số lọc và phân trang
   * @returns {Promise<Object>} - Promise trả về danh sách quy định và thông tin phân trang
   */
  getRegulations(params = {}) {
    // Mô phỏng API call với delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page = 1, limit = 10, filter } = params;
        
        // Lọc quy định theo filter (nếu có)
        let filteredRegulations = [...sampleRegulations];
        
        if (filter === 'read') {
          // Lấy trạng thái đã đọc từ localStorage
          const readStatus = this.getReadStatus();
          filteredRegulations = filteredRegulations.filter(
            regulation => readStatus[regulation.id] === true
          );
        } else if (filter === 'unread') {
          // Lấy trạng thái đã đọc từ localStorage
          const readStatus = this.getReadStatus();
          filteredRegulations = filteredRegulations.filter(
            regulation => readStatus[regulation.id] !== true
          );
        }
        
        // Tính toán phân trang
        const total = filteredRegulations.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRegulations = filteredRegulations.slice(startIndex, endIndex);
        
        // Thêm trạng thái đã đọc từ localStorage
        const readStatus = this.getReadStatus();
        const regulationsWithReadStatus = paginatedRegulations.map(regulation => ({
          ...regulation,
          read: readStatus[regulation.id] === true
        }));
        
        resolve({
          data: regulationsWithReadStatus,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit
          }
        });
      }, 300); // Giả lập delay mạng 300ms
    });
  },
  
  /**
   * Lấy chi tiết một quy định
   * @param {number} id - ID của quy định
   * @returns {Promise<Object>} - Promise trả về thông tin chi tiết quy định
   */
  getRegulationById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const regulation = sampleRegulations.find(r => r.id === id);
        
        if (regulation) {
          const readStatus = this.getReadStatus();
          resolve({
            ...regulation,
            read: readStatus[regulation.id] === true
          });
        } else {
          reject(new Error('Không tìm thấy quy định'));
        }
      }, 200);
    });
  },
  
  /**
   * Cập nhật trạng thái đọc của quy định
   * @param {number} id - ID của quy định
   * @param {boolean} read - Trạng thái đọc (true = đã đọc, false = chưa đọc)
   * @returns {Promise<Object>} - Promise trả về quy định đã cập nhật
   */
  updateReadStatus(id, read) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Lưu trạng thái vào localStorage
        const readStatus = this.getReadStatus();
        readStatus[id] = read;
        this.saveReadStatus(readStatus);
        
        const regulation = sampleRegulations.find(r => r.id === parseInt(id));
        if (regulation) {
          resolve({
            ...regulation,
            read
          });
        } else {
          resolve(null);
        }
      }, 200);
    });
  },
  
  /**
   * Đánh dấu tất cả quy định là đã đọc
   * @returns {Promise<boolean>} - Promise trả về true nếu thành công
   */
  markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const readStatus = {};
        sampleRegulations.forEach(regulation => {
          readStatus[regulation.id] = true;
        });
        
        this.saveReadStatus(readStatus);
        resolve(true);
      }, 300);
    });
  },
  
  /**
   * Lấy trạng thái đã đọc từ localStorage
   * @returns {Object} - Object chứa trạng thái đã đọc
   */
  getReadStatus() {
    try {
      const storedStatus = localStorage.getItem(READ_STATUS_KEY);
      return storedStatus ? JSON.parse(storedStatus) : {};
    } catch (error) {
      console.error('Failed to load read status from localStorage:', error);
      return {};
    }
  },
  
  /**
   * Lưu trạng thái đã đọc vào localStorage
   * @param {Object} readStatus - Object chứa trạng thái đã đọc
   */
  saveReadStatus(readStatus) {
    try {
      localStorage.setItem(READ_STATUS_KEY, JSON.stringify(readStatus));
    } catch (error) {
      console.error('Failed to save read status to localStorage:', error);
    }
  }
};