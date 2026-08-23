import React, { useEffect, useState } from 'react';
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

const COLORS = [
  { bg: '#fce4ec', text: '#880e4f' },
  { bg: '#e8f5e9', text: '#1b5e20' },
  { bg: '#fffde7', text: '#f57f17' },
  { bg: '#e1f5fe', text: '#01579b' },
  { bg: '#f3e5f5', text: '#4a148c' }
];

const DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس'
];

function App() {
  // ==============================
  // جدول المواد
  // ==============================

  const [schedule, setSchedule] = useState(() => {
    try {
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
    } catch {
      return [];
    }
  });

  // ==============================
  // المهام والاختبارات
  // ==============================

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('my_study_tasks');

      return saved
        ? JSON.parse(saved)
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
    } catch {
      return [];
    }
  });

  // ==============================
  // النوافذ
  // ==============================

  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // ==============================
  // بيانات المادة الجديدة
  // ==============================

  const [newSubject, setNewSubject] = useState({
    day: 'الأحد',
    time: '',
    subject: '',
    instructor: '',
    room: ''
  });

  // ==============================
  // بيانات المهمة الجديدة
  // ==============================

  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    date: '',
    type: 'واجب'
  });

  // ==============================
  // حفظ تلقائي
  // ==============================

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

  // ==============================
  // إضافة مادة
  // ==============================

  const handleAddSubject = (e) => {
    e.preventDefault();

    if (!newSubject.subject.trim() || !newSubject.time.trim()) {
      return;
    }

    const randomColor =
      COLORS[Math.floor(Math.random() * COLORS.length)];

    const newItem = {
      id: Date.now(),
      day: newSubject.day,
      time: newSubject.time.trim(),
      subject: newSubject.subject.trim(),
      instructor: newSubject.instructor.trim(),
      room: newSubject.room.trim(),
      bg: randomColor.bg,
      text: randomColor.text
    };

    setSchedule((prev) => [...prev, newItem]);

    setNewSubject({
      day: 'الأحد',
      time: '',
      subject: '',
      instructor: '',
      room: ''
    });

    setShowModal(false);
  };

  // ==============================
  // إضافة مهمة
  // ==============================

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.date) {
      return;
    }

    const newItem = {
      id: Date.now(),
      title: newTask.title.trim(),
      subject: newTask.subject.trim(),
      date: newTask.date,
      type: newTask.type,
      completed: false
    };

    setTasks((prev) => [...prev, newItem]);

    setNewTask({
      title: '',
      subject: '',
      date: '',
      type: 'واجب'
    });

    setShowTaskModal(false);
  };

  // ==============================
  // حذف مادة
  // ==============================

  const deleteSubject = (id) => {
    setSchedule((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ==============================
  // حذف مهمة
  // ==============================

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // ==============================
  // تغيير حالة المهمة
  // ==============================

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

  const upcomingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        html {
          width: 100%;
          overflow-x: hidden;
        }

        body {
          margin: 0;
          width: 100%;
          min-width: 0;
          background: #faf7f5;
          font-family: Arial, sans-serif;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        /* ==========================
           الصفحة الرئيسية
        ========================== */

        .app {
          width: 100%;
          min-height: 100vh;
          padding: 30px;
          background: #faf7f5;
          direction: rtl;
        }

        /* ==========================
           Header
        ========================== */

        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .header-title {
          margin: 0;
          color: #4a4e69;
          font-size: 32px;
          line-height: 1.3;
        }

        .header-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .header-button {
          border: none;
          min-height: 44px;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
        }

        /* ==========================
           بطاقات الملخص
        ========================== */

        .summary-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          min-width: 0;
          background: #ffffff;
          padding: 20px;
          border-radius: 16px;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .summary-title {
          margin: 10px 0 5px;
          color: #4a4e69;
          font-size: 18px;
        }

        .summary-text {
          color: #a5a58d;
          font-size: 14px;
        }

        /* ==========================
           الأقسام
        ========================== */

        .section {
          width: 100%;
          min-width: 0;
          background: #ffffff;
          padding: 25px;
          border-radius: 20px;
          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.03);
          margin-bottom: 30px;
        }

        .section-title {
          margin: 0 0 20px;
          color: #4a4e69;
          font-size: 20px;
        }

        /* ==========================
           الجدول
        ========================== */

        .table-scroll {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          border-radius: 12px;
        }

        .schedule-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          text-align: right;
          table-layout: auto;
        }

        .schedule-table th,
        .schedule-table td {
          white-space: nowrap;
          vertical-align: middle;
        }

        .schedule-table th {
          padding: 12px;
          color: #a5a58d;
          font-size: 14px;
          border-bottom: 2px solid #f0f0f0;
        }

        .schedule-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f8f9fa;
        }

        .subject-badge {
          display: inline-block;
          white-space: nowrap;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .instructor {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .delete-button {
          width: 42px;
          height: 42px;
          padding: 0;
          border: none;
          border-radius: 10px;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          touch-action: manipulation;
        }

        .delete-button:active {
          background: #fff0f0;
          transform: scale(0.95);
        }

        .mobile-table-note {
          display: none;
          margin: 12px 0 0;
          text-align: center;
          color: #adb5bd;
          font-size: 12px;
        }

        /* ==========================
           المهام
        ========================== */

        .tasks {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task {
          width: 100%;
          min-width: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 14px 18px;
          border-radius: 14px;
        }

        .task-main {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .task-info {
          min-width: 0;
        }

        .task-title {
          margin: 0;
          color: #4a4e69;
          font-size: 16px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .task-details {
          display: block;
          color: #8d99ae;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .task-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .task-type {
          white-space: nowrap;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        /* ==========================
           النوافذ المنبثقة
        ========================== */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow-y: auto;
        }

        .modal {
          width: min(400px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
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
          flex-shrink: 0;
          border: none;
          background: transparent;
          padding: 6px;
          cursor: pointer;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          color: #6c757d;
          font-size: 14px;
        }

        .form-input,
        .form-select {
          width: 100%;
          min-width: 0;
          padding: 11px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          outline: none;
          background: #ffffff;
          font-size: 16px;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #a8e0ff;
        }

        .submit-button {
          width: 100%;
          min-height: 46px;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
        }

        /* ==========================
           Tablet
        ========================== */

        @media (max-width: 900px) {

          .app {
            padding: 20px;
          }

          .header {
            align-items: flex-start;
          }

          .summary-grid {
            gap: 15px;
          }

          .section {
            padding: 20px;
          }

        }

        /* ==========================
           الجوال
        ========================== */

        @media (max-width: 600px) {

          .app {
            padding: 12px;
          }

          .header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            margin-bottom: 20px;
          }

          .header-title {
            font-size: 25px;
          }

          .header-buttons {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
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

          .section {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 16px;
          }

          .section-title {
            font-size: 18px;
          }

          /*
             الجدول لا ينضغط على الجوال.
             يبقى بعرضه الطبيعي ويمكن سحبه.
          */

          .schedule-table {
            min-width: 760px;
          }

          .schedule-table th,
          .schedule-table td {
            padding: 13px 10px;
          }

          .mobile-table-note {
            display: block;
          }

          /* المهام */

          .task {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
          }

          .task-actions {
            width: 100%;
            justify-content: space-between;
          }

          /* Modal */

          .modal-overlay {
            padding: 12px;
          }

          .modal {
            width: 100%;
            max-height: calc(100vh - 24px);
            padding: 20px;
            border-radius: 18px;
          }

          .modal-title {
            font-size: 18px;
          }

        }

        /* ==========================
           الجوالات الصغيرة جدًا
        ========================== */

        @media (max-width: 380px) {

          .app {
            padding: 8px;
          }

          .section {
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

      <main className="app">

        {/* ==========================
            Header
        ========================== */}

        <header className="header">

          <h1 className="header-title">
            الجدول الدراسي 👩‍💻
          </h1>

          <div className="header-buttons">

            <button
              type="button"
              className="header-button"
              style={{
                backgroundColor: '#a8e0ff',
                color: '#1d3557'
              }}
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              إضافة مادة
            </button>

            <button
              type="button"
              className="header-button"
              style={{
                backgroundColor: '#ed5a39',
                color: '#ffffff'
              }}
              onClick={() => setShowTaskModal(true)}
            >
              <Plus size={18} />
              إضافة اختبار/تطبيق
            </button>

          </div>

        </header>

        {/* ==========================
            Summary
        ========================== */}

        <section className="summary-grid">

          <div className="summary-card">

            <BookOpen
              color="#edafb8"
              size={28}
            />

            <h3 className="summary-title">
              {schedule.length} مواد
            </h3>

            <span className="summary-text">
              المسجلة في الجدول
            </span>

          </div>

          <div className="summary-card">

            <Clock
              color="#f8ad9d"
              size={28}
            />

            <h3 className="summary-title">
              {schedule.length * 3} ساعات
            </h3>

            <span className="summary-text">
              إجمالي الساعات التقديرية
            </span>

          </div>

          <div className="summary-card">

            <Calendar
              color="#aadbf5"
              size={28}
            />

            <h3 className="summary-title">
              {upcomingTasks} مهام قادمة
            </h3>

            <span className="summary-text">
              اختبارات وتكليفات قريبة
            </span>

          </div>

        </section>

        {/* ==========================
            جدول الأسبوع
        ========================== */}

        <section className="section">

          <h2 className="section-title">
            جدول الأسبوع
          </h2>

          <div className="table-scroll">

            <table className="schedule-table">

              <thead>

                <tr>

                  <th>اليوم</th>
                  <th>الوقت</th>
                  <th>المادة</th>
                  <th>الدكتور/ة</th>
                  <th>القاعة</th>
                  <th>حذف</th>

                </tr>

              </thead>

              <tbody>

                {schedule.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: 'center',
                        color: '#a5a58d',
                        padding: '30px'
                      }}
                    >
                      لا توجد مواد مضافة حاليًا.
                    </td>

                  </tr>

                ) : (

                  schedule.map((item) => (

                    <tr key={item.id}>

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

                        <span className="instructor">

                          <User
                            size={16}
                            color="#adb5bd"
                          />

                          {item.instructor ||
                            'غير محدد'}

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
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteSubject(item.id)
                          }
                          aria-label={`حذف ${item.subject}`}
                          title="حذف المادة"
                        >
                          <Trash2
                            size={19}
                            color="#e57373"
                          />
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          <p className="mobile-table-note">
            اسحبي الجدول يمينًا ويسارًا لرؤية باقي الأعمدة 📱
          </p>

        </section>

        {/* ==========================
            المهام
        ========================== */}

        <section className="section">

          <h2 className="section-title">
            مواعيد الاختبارات والتكليفات القادمة 🎯
          </h2>

          <div className="tasks">

            {tasks.length === 0 ? (

              <p
                style={{
                  color: '#a5a58d',
                  margin: 0
                }}
              >
                لا توجد اختبارات أو تكليفات مضافة حاليًا.
              </p>

            ) : (

              tasks.map((task) => (

                <div
                  key={task.id}
                  className="task"
                  style={{
                    backgroundColor: task.completed
                      ? '#f8f9fa'
                      : '#fff5f5',

                    borderRight:
                      task.type === 'اختبار'
                        ? '5px solid #f8ad9d'
                        : '5px solid #b5e2fa',

                    textDecoration: task.completed
                      ? 'line-through'
                      : 'none',

                    opacity: task.completed
                      ? 0.6
                      : 1
                  }}
                >

                  <div className="task-main">

                    <CheckCircle2
                      size={22}
                      color={
                        task.completed
                          ? '#66bb6a'
                          : '#cccccc'
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
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      aria-label={`حذف ${task.title}`}
                      title="حذف المهمة"
                    >
                      <Trash2
                        size={19}
                        color="#e57373"
                      />
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        {/* ==========================
            Modal: إضافة مادة
        ========================== */}

        {showModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h3 className="modal-title">
                  إضافة مادة جديدة 📝
                </h3>

                <button
                  type="button"
                  className="close-button"
                  onClick={() =>
                    setShowModal(false)
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
                className="form"
                onSubmit={handleAddSubject}
              >

                <div>

                  <label className="form-label">
                    اليوم
                  </label>

                  <select
                    className="form-select"
                    value={newSubject.day}
                    onChange={(e) =>
                      setNewSubject((prev) => ({
                        ...prev,
                        day: e.target.value
                      }))
                    }
                  >

                    {DAYS.map((day) => (
                      <option
                        key={day}
                        value={day}
                      >
                        {day}
                      </option>
                    ))}

                  </select>

                </div>

                <div>

                  <label className="form-label">
                    اسم المادة
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: ذكاء اصطناعي"
                    value={newSubject.subject}
                    onChange={(e) =>
                      setNewSubject((prev) => ({
                        ...prev,
                        subject: e.target.value
                      }))
                    }
                    required
                  />

                </div>

                <div>

                  <label className="form-label">
                    الوقت
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: 08:00 ص - 10:00 ص"
                    value={newSubject.time}
                    onChange={(e) =>
                      setNewSubject((prev) => ({
                        ...prev,
                        time: e.target.value
                      }))
                    }
                    required
                  />

                </div>

                <div>

                  <label className="form-label">
                    اسم الدكتور/ة
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: د. أحمد"
                    value={newSubject.instructor}
                    onChange={(e) =>
                      setNewSubject((prev) => ({
                        ...prev,
                        instructor: e.target.value
                      }))
                    }
                  />

                </div>

                <div>

                  <label className="form-label">
                    القاعة
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: Lab 2"
                    value={newSubject.room}
                    onChange={(e) =>
                      setNewSubject((prev) => ({
                        ...prev,
                        room: e.target.value
                      }))
                    }
                  />

                </div>

                <button
                  className="submit-button"
                  type="submit"
                  style={{
                    backgroundColor: '#f8ad9d',
                    color: '#ffffff'
                  }}
                >
                  حفظ المادة
                </button>

              </form>

            </div>

          </div>

        )}

        {/* ==========================
            Modal: إضافة اختبار
        ========================== */}

        {showTaskModal && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <h3 className="modal-title">
                  إضافة موعد قادم 🎯
                </h3>

                <button
                  type="button"
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
                className="form"
                onSubmit={handleAddTask}
              >

                <div>

                  <label className="form-label">
                    العنوان
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: كويز الفصل الأول"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    required
                  />

                </div>

                <div>

                  <label className="form-label">
                    المادة
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    placeholder="مثال: قواعد بيانات"
                    value={newTask.subject}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        subject: e.target.value
                      }))
                    }
                  />

                </div>

                <div>

                  <label className="form-label">
                    النوع
                  </label>

                  <select
                    className="form-select"
                    value={newTask.type}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        type: e.target.value
                      }))
                    }
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

                <div>

                  <label className="form-label">
                    التاريخ
                  </label>

                  <input
                    className="form-input"
                    type="date"
                    value={newTask.date}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        date: e.target.value
                      }))
                    }
                    required
                  />

                </div>

                <button
                  className="submit-button"
                  type="submit"
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

      </main>
    </>
  );
}

export default App;