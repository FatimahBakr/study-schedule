import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  User,
  Plus,
  X,
  Trash2,
  CheckCircle2,
  Calendar
} from 'lucide-react';

function App() {
  // =========================================
  // 1. حالة جدول المحاضرات
  // =========================================

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('my_study_schedule');

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            day: 'الأحد',
            time: '08:00 ص - 10:00 ص',
            subject: 'برمجة ويب',
            instructor: 'د. سارة',
            room: 'Lab 3',
            bg: '#fce4ec',
            text: '#880e4f'
          },
          {
            id: 2,
            day: 'الأحد',
            time: '10:00 ص - 12:00 م',
            subject: 'قواعد بيانات',
            instructor: 'د. خالد',
            room: 'Hall B',
            bg: '#e8f5e9',
            text: '#1b5e20'
          }
        ];
  });

  // =========================================
  // 2. حالة التكليفات والاختبارات
  // =========================================

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('my_study_tasks');

    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            title: 'مشروع النصفي',
            subject: 'برمجة ويب',
            date: '2026-09-10',
            type: 'مشروع',
            completed: false
          },
          {
            id: 2,
            title: 'كويز الفصل الأول',
            subject: 'قواعد بيانات',
            date: '2026-09-02',
            type: 'اختبار',
            completed: false
          }
        ];
  });

  // =========================================
  // 3. الحفظ التلقائي
  // =========================================

  useEffect(() => {
    localStorage.setItem(
      'my_study_schedule',
      JSON.stringify(schedule)
    );
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(
      'my_study_tasks',
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // =========================================
  // 4. النوافذ والمدخلات
  // =========================================

  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [newSubject, setNewSubject] = useState({
    day: 'الأحد',
    time: '',
    subject: '',
    instructor: '',
    room: ''
  });

  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    date: '',
    type: 'واجب'
  });

  // =========================================
  // 5. ألوان المواد
  // =========================================

  const colors = [
    { bg: '#fce4ec', text: '#880e4f' },
    { bg: '#e8f5e9', text: '#1b5e20' },
    { bg: '#fffde7', text: '#f57f17' },
    { bg: '#e1f5fe', text: '#01579b' },
    { bg: '#f3e5f5', text: '#4a148c' }
  ];

  // =========================================
  // 6. إضافة مادة
  // =========================================

  const handleAddSubject = (e) => {
    e.preventDefault();

    if (!newSubject.subject || !newSubject.time) {
      return;
    }

    const randomColor =
      colors[Math.floor(Math.random() * colors.length)];

    const newItem = {
      id: Date.now(),
      ...newSubject,
      bg: randomColor.bg,
      text: randomColor.text
    };

    setSchedule((prev) => [...prev, newItem]);

    setShowModal(false);

    setNewSubject({
      day: 'الأحد',
      time: '',
      subject: '',
      instructor: '',
      room: ''
    });
  };

  // =========================================
  // 7. إضافة اختبار / تكليف
  // =========================================

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.title || !newTask.date) {
      return;
    }

    const item = {
      id: Date.now(),
      ...newTask,
      completed: false
    };

    setTasks((prev) => [...prev, item]);

    setShowTaskModal(false);

    setNewTask({
      title: '',
      subject: '',
      date: '',
      type: 'واجب'
    });
  };

  // =========================================
  // 8. تغيير حالة المهمة
  // =========================================

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  };

  // =========================================
  // 9. حذف مادة
  // =========================================

  const deleteSubject = (id) => {
    setSchedule((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================================
  // 10. حذف مهمة
  // =========================================

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // =========================================
  // الواجهة
  // =========================================

  return (
    <>
      {/* ================================
          Responsive CSS
      ================================= */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #faf7f5;
          font-family: sans-serif;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .app-container {
          width: 100%;
          min-height: 100vh;
          padding: 30px;
          background: #faf7f5;
          direction: rtl;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .header-button {
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 44px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(180px, 1fr)
          );
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          min-width: 0;
        }

        .section-card {
          width: 100%;
          background: #ffffff;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          margin-bottom: 30px;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          border-radius: 12px;
        }

        .schedule-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          text-align: right;
        }

        .schedule-table th,
        .schedule-table td {
          white-space: nowrap;
        }

        .schedule-table th {
          padding: 12px;
        }

        .schedule-table td {
          padding: 16px 12px;
        }

        .subject-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          white-space: nowrap;
        }

        .instructor-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .delete-button {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          touch-action: manipulation;
        }

        .delete-button:hover {
          background: #fff1f1;
        }

        .tasks-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 14px 18px;
          border-radius: 14px;
          min-width: 0;
        }

        .task-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .task-info {
          min-width: 0;
        }

        .task-title {
          margin: 0;
          color: #4a4e69;
          font-size: 16px;
          overflow-wrap: anywhere;
        }

        .task-details {
          font-size: 13px;
          color: #8d99ae;
          overflow-wrap: anywhere;
        }

        .task-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .task-type {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal {
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          width: min(400px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .modal-title {
          margin: 0;
          color: #4a4e69;
          font-size: 20px;
        }

        .close-button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 6px;
          flex-shrink: 0;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          outline: none;
          font-size: 16px;
          background: #fff;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #b5e2fa;
        }

        .submit-button {
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          min-height: 46px;
          font-size: 15px;
        }

        /* ================================
           Tablet
        ================================= */

        @media (max-width: 900px) {
          .app-container {
            padding: 20px;
          }

          .top-header {
            align-items: flex-start;
          }

          .section-card {
            padding: 20px;
          }

          .summary-grid {
            gap: 15px;
          }
        }

        /* ================================
           Mobile
        ================================= */

        @media (max-width: 600px) {
          .app-container {
            padding: 12px;
          }

          .top-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            margin-bottom: 20px;
          }

          .top-header h1 {
            font-size: 25px !important;
          }

          .header-buttons {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .header-button {
            width: 100%;
          }

          .summary-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }

          .summary-card {
            padding: 16px;
          }

          .section-card {
            padding: 15px;
            border-radius: 16px;
            margin-bottom: 20px;
          }

          .section-card h2 {
            font-size: 18px !important;
          }

          .table-wrapper {
            margin-top: 5px;
          }

          .schedule-table {
            min-width: 760px;
          }

          .schedule-table th {
            padding: 11px 10px;
          }

          .schedule-table td {
            padding: 14px 10px;
          }

          .task-item {
            flex-direction: column;
            align-items: stretch;
            padding: 14px;
          }

          .task-actions {
            width: 100%;
            justify-content: space-between;
            padding-right: 34px;
          }

          .modal-overlay {
            padding: 12px;
            align-items: center;
          }

          .modal {
            padding: 20px;
            border-radius: 18px;
            width: 100%;
            max-height: calc(100vh - 24px);
          }

          .modal-title {
            font-size: 18px;
          }
        }

        /* ================================
           Small phones
        ================================= */

        @media (max-width: 380px) {
          .app-container {
            padding: 8px;
          }

          .section-card {
            padding: 12px;
          }

          .summary-card {
            padding: 14px;
          }

          .modal {
            padding: 16px;
          }
        }
      `}</style>

      {/* ================================
          التطبيق
      ================================= */}

      <div className="app-container">

        {/* ================================
            الترويسة
        ================================= */}

        <header className="top-header">

          <div>
            <h1
              style={{
                color: '#4a4e69',
                margin: 0,
                fontSize: '32px'
              }}
            >
              الجدول الدراسي 👩‍💻
            </h1>
          </div>

          <div className="header-buttons">

            <button
              onClick={() => setShowModal(true)}
              className="header-button"
              style={{
                backgroundColor: '#a8e0ff',
                color: '#1d3557'
              }}
            >
              <Plus size={18} />
              إضافة مادة
            </button>

            <button
              onClick={() => setShowTaskModal(true)}
              className="header-button"
              style={{
                backgroundColor: '#ed5a39',
                color: '#fff'
              }}
            >
              <Plus size={18} />
              إضافة اختبار/تطبيق
            </button>

          </div>

        </header>

        {/* ================================
            بطاقات الملخص
        ================================= */}

        <div className="summary-grid">

          <div className="summary-card">
            <BookOpen color="#edafb8" size={28} />

            <h3
              style={{
                margin: '10px 0 5px',
                color: '#4a4e69'
              }}
            >
              {schedule.length} مواد
            </h3>

            <span
              style={{
                color: '#a5a58d',
                fontSize: '14px'
              }}
            >
              المسجلة في الجدول
            </span>
          </div>

          <div className="summary-card">
            <Clock color="#f8ad9d" size={28} />

            <h3
              style={{
                margin: '10px 0 5px',
                color: '#4a4e69'
              }}
            >
              {schedule.length * 3} ساعات
            </h3>

            <span
              style={{
                color: '#a5a58d',
                fontSize: '14px'
              }}
            >
              إجمالي الساعات التقديرية
            </span>
          </div>

          <div className="summary-card">
            <Calendar color="#aadbf5" size={28} />

            <h3
              style={{
                margin: '10px 0 5px',
                color: '#4a4e69'
              }}
            >
              {tasks.filter((task) => !task.completed).length} مهام قادمة
            </h3>

            <span
              style={{
                color: '#a5a58d',
                fontSize: '14px'
              }}
            >
              اختبارات وتكليفات قريبة
            </span>
          </div>

        </div>

        {/* ================================
            جدول المحاضرات
        ================================= */}

        <div className="section-card">

          <h2
            style={{
              color: '#4a4e69',
              marginBottom: '20px',
              fontSize: '20px'
            }}
          >
            جدول الأسبوع
          </h2>

          <div className="table-wrapper">

            <table className="schedule-table">

              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid #f0f0f0',
                    color: '#a5a58d'
                  }}
                >
                  <th>اليوم</th>
                  <th>الوقت</th>
                  <th>المادة</th>
                  <th>الدكتور/ة</th>
                  <th>القاعة</th>
                  <th>حذف</th>
                </tr>
              </thead>

              <tbody>

                {schedule.map((item) => (

                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #f8f9fa'
                    }}
                  >

                    <td
                      style={{
                        fontWeight: 'bold',
                        color: '#6c757d'
                      }}
                    >
                      {item.day}
                    </td>

                    <td
                      style={{
                        color: '#6c757d'
                      }}
                    >
                      {item.time}
                    </td>

                    <td>

                      <span
                        className="subject-badge"
                        style={{
                          backgroundColor: item.bg,
                          color: item.text
                        }}
                      >
                        {item.subject}
                      </span>

                    </td>

                    <td
                      style={{
                        color: '#495057'
                      }}
                    >

                      <span className="instructor-cell">

                        <User
                          size={16}
                          color="#adb5bd"
                        />

                        {item.instructor || 'غير محدد'}

                      </span>

                    </td>

                    <td
                      style={{
                        color: '#6c757d'
                      }}
                    >
                      {item.room || '-'}
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteSubject(item.id)
                        }
                        aria-label="حذف المادة"
                      >
                        <Trash2
                          size={18}
                          color="#e57373"
                        />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ملاحظة للجوال */}

          <p
            style={{
              margin: '12px 0 0',
              color: '#adb5bd',
              fontSize: '12px',
              textAlign: 'center'
            }}
          >
            اسحبي الجدول يمينًا ويسارًا لرؤية باقي الأعمدة 📱
          </p>

        </div>

        {/* ================================
            الاختبارات والتكليفات
        ================================= */}

        <div className="section-card">

          <h2
            style={{
              color: '#4a4e69',
              marginBottom: '20px',
              fontSize: '20px'
            }}
          >
            مواعيد الاختبارات والتكليفات القادمة 🎯
          </h2>

          <div className="tasks-container">

            {tasks.length === 0 ? (

              <p
                style={{
                  color: '#a5a58d'
                }}
              >
                لا توجد اختبارات أو تكليفات مضافة حالياً.
              </p>

            ) : (

              tasks.map((task) => (

                <div
                  key={task.id}
                  className="task-item"
                  style={{
                    backgroundColor: task.completed
                      ? '#f8f9fa'
                      : '#fff5f5',

                    borderRight: `5px solid ${
                      task.type === 'اختبار'
                        ? '#f8ad9d'
                        : '#b5e2fa'
                    }`,

                    textDecoration: task.completed
                      ? 'line-through'
                      : 'none',

                    opacity: task.completed ? 0.6 : 1
                  }}
                >

                  <div className="task-main">

                    <CheckCircle2
                      size={22}
                      color={
                        task.completed
                          ? '#66bb6a'
                          : '#ccc'
                      }
                      style={{
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      onClick={() =>
                        toggleTaskStatus(task.id)
                      }
                    />

                    <div className="task-info">

                      <h4 className="task-title">
                        {task.title}
                      </h4>

                      <span className="task-details">

                        {task.subject
                          ? `${task.subject} • `
                          : ''}

                        تاريخ الاستحقاق: {task.date}

                      </span>

                    </div>

                  </div>

                  <div className="task-actions">

                    <span
                      className="task-type"
                      style={{
                        backgroundColor:
                          task.type === 'اختبار'
                            ? '#ffebee'
                            : '#e1f5fe',

                        color:
                          task.type === 'اختبار'
                            ? '#c62828'
                            : '#0277bd'
                      }}
                    >
                      {task.type}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      aria-label="حذف المهمة"
                    >
                      <Trash2
                        size={18}
                        color="#e57373"
                      />
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        {/* ================================
            نافذة إضافة مادة
        ================================= */}

        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h3 className="modal-title">
                  إضافة مادة جديدة 📝
                </h3>

                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                  aria-label="إغلاق"
                >
                  <X
                    size={20}
                    color="#a5a58d"
                  />
                </button>

              </div>

              <form
                onSubmit={handleAddSubject}
                className="form"
              >

                {/* اليوم */}

                <div>

                  <label className="form-label">
                    اليوم
                  </label>

                  <select
                    value={newSubject.day}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        day: e.target.value
                      })
                    }
                    className="form-select"
                  >

                    <option value="الأحد">
                      الأحد
                    </option>

                    <option value="الإثنين">
                      الإثنين
                    </option>

                    <option value="الثلاثاء">
                      الثلاثاء
                    </option>

                    <option value="الأربعاء">
                      الأربعاء
                    </option>

                    <option value="الخميس">
                      الخميس
                    </option>

                  </select>

                </div>

                {/* اسم المادة */}

                <div>

                  <label className="form-label">
                    اسم المادة
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: ذكاء اصطناعي"
                    value={newSubject.subject}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        subject: e.target.value
                      })
                    }
                    className="form-input"
                    required
                  />

                </div>

                {/* الوقت */}

                <div>

                  <label className="form-label">
                    الوقت
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: 08:00 ص - 10:00 ص"
                    value={newSubject.time}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        time: e.target.value
                      })
                    }
                    className="form-input"
                    required
                  />

                </div>

                {/* الدكتور */}

                <div>

                  <label className="form-label">
                    اسم الدكتور/ة
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: د. أحمد"
                    value={newSubject.instructor}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        instructor: e.target.value
                      })
                    }
                    className="form-input"
                  />

                </div>

                {/* القاعة */}

                <div>

                  <label className="form-label">
                    القاعة
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: Lab 2"
                    value={newSubject.room}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        room: e.target.value
                      })
                    }
                    className="form-input"
                  />

                </div>

                <button
                  type="submit"
                  className="submit-button"
                  style={{
                    backgroundColor: '#f8ad9d',
                    color: '#fff'
                  }}
                >
                  حفظ المادة
                </button>

              </form>

            </div>

          </div>

        )}

        {/* ================================
            نافذة إضافة اختبار / تكليف
        ================================= */}

        {showTaskModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h3 className="modal-title">
                  إضافة موعد قادم 🎯
                </h3>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowTaskModal(false)
                  }
                  aria-label="إغلاق"
                >
                  <X
                    size={20}
                    color="#a5a58d"
                  />
                </button>

              </div>

              <form
                onSubmit={handleAddTask}
                className="form"
              >

                {/* العنوان */}

                <div>

                  <label className="form-label">
                    العنوان
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: كويز الفصل الأول"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        title: e.target.value
                      })
                    }
                    className="form-input"
                    required
                  />

                </div>

                {/* المادة */}

                <div>

                  <label className="form-label">
                    المادة
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: قواعد بيانات"
                    value={newTask.subject}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        subject: e.target.value
                      })
                    }
                    className="form-input"
                  />

                </div>

                {/* النوع */}

                <div>

                  <label className="form-label">
                    النوع
                  </label>

                  <select
                    value={newTask.type}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        type: e.target.value
                      })
                    }
                    className="form-select"
                  >

                    <option value="اختبار">
                      اختبار
                    </option>

                    <option value="واجب">
                      واجب
                    </option>

                    <option value="مشروع">
                      مشروع
                    </option>

                  </select>

                </div>

                {/* التاريخ */}

                <div>

                  <label className="form-label">
                    التاريخ
                  </label>

                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        date: e.target.value
                      })
                    }
                    className="form-input"
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="submit-button"
                  style={{
                    backgroundColor: '#b5e2fa',
                    color: '#1d3557'
                  }}
                >
                  حفظ الموعد
                </button>

              </form>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default App;