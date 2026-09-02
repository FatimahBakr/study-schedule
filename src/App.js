import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, User, Plus, X, Trash2, CheckCircle2, Calendar, DollarSign, Edit2, Check } from 'lucide-react';

function App() {
  // 1. حالات البيانات المخزنة
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('my_study_schedule');
    return saved ? JSON.parse(saved) : [
      { id: 1, day: 'الأحد', time: '08:00 ص - 10:00 ص', subject: 'برمجة ويب', instructor: 'د. سارة', room: 'Lab 3', bg: '#fce4ec', text: '#880e4f' }
    ];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('my_study_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [tutors, setTutors] = useState(() => {
    const saved = localStorage.getItem('my_study_tutors');
    return saved ? JSON.parse(saved) : [
      { id: 1, subject: 'رياضيات معقدة', tutorName: 'م. خالد', totalAmount: 1200, monthsCount: 3, paidMonths: 1 }
    ];
  });

  // الحفظ التلقائي
  useEffect(() => { localStorage.setItem('my_study_schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('my_study_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('my_study_tutors', JSON.stringify(tutors)); }, [tutors]);

  // حالات النوافذ
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);

  // حالة التعديل (تخزين العنصر الجاري تعديله)
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // حالات المدخلات
  const [newSubject, setNewSubject] = useState({ day: 'الأحد', time: '', subject: '', instructor: '', room: '' });
  const [newTask, setNewTask] = useState({ title: '', subject: '', date: '', type: 'واجب' });
  const [newTutor, setNewTutor] = useState({ subject: '', tutorName: '', totalAmount: '', monthsCount: '' });

  const colors = [
    { bg: '#fce4ec', text: '#880e4f' }, { bg: '#e8f5e9', text: '#1b5e20' },
    { bg: '#fffde7', text: '#f57f17' }, { bg: '#e1f5fe', text: '#01579b' }, { bg: '#f3e5f5', text: '#4a148c' }
  ];

  // --- إضافة أو تعديل مادة ---
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!newSubject.subject || !newSubject.time) return;

    if (editingSubjectId) {
      // تعديل مادة موجودة
      setSchedule(schedule.map(item => item.id === editingSubjectId ? { ...item, ...newSubject } : item));
      setEditingSubjectId(null);
    } else {
      // إضافة مادة جديدة
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setSchedule([...schedule, { id: Date.now(), ...newSubject, bg: randomColor.bg, text: randomColor.text }]);
    }

    setShowSubjectModal(false);
    setNewSubject({ day: 'الأحد', time: '', subject: '', instructor: '', room: '' });
  };

  const handleEditSubject = (item) => {
    setEditingSubjectId(item.id);
    setNewSubject({ day: item.day, time: item.time, subject: item.subject, instructor: item.instructor, room: item.room });
    setShowSubjectModal(true);
  };

  // --- إضافة مدرس خصوصي ---
  const handleAddTutor = (e) => {
    e.preventDefault();
    if (!newTutor.subject || !newTutor.totalAmount || !newTutor.monthsCount) return;

    setTutors([...tutors, {
      id: Date.now(),
      subject: newTutor.subject,
      tutorName: newTutor.tutorName,
      totalAmount: Number(newTutor.totalAmount),
      monthsCount: Number(newTutor.monthsCount),
      paidMonths: 0
    }]);

    setShowTutorModal(false);
    setNewTutor({ subject: '', tutorName: '', totalAmount: '', monthsCount: '' });
  };

  // دفع شهر إضافي للمدرس الخصوصي
  const handlePayMonth = (id) => {
    setTutors(tutors.map(t => {
      if (t.id === id && t.paidMonths < t.monthsCount) {
        return { ...t, paidMonths: t.paidMonths + 1 };
      }
      return t;
    }));
  };

  // --- إضافة اختبار / تكليف ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.date) return;
    setTasks([...tasks, { id: Date.now(), ...newTask, completed: false }]);
    setShowTaskModal(false);
    setNewTask({ title: '', subject: '', date: '', type: 'واجب' });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#faf7f5', minHeight: '100vh', direction: 'rtl' }}>
      
      {/* الترويسة العلويّة */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ color: '#4a4e69', margin: 0 }}>جدولي الدراسي 🌸</h1>
          <p style={{ color: '#8d99ae', marginTop: '5px' }}>منظم المحاضرات، الاختبارات، والدروس الخصوصية</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => { setEditingSubjectId(null); setNewSubject({ day: 'الأحد', time: '', subject: '', instructor: '', room: '' }); setShowSubjectModal(true); }} style={{ backgroundColor: '#b5e2fa', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', color: '#1d3557', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> إضافة مادة
          </button>
          <button onClick={() => setShowTutorModal(true)} style={{ backgroundColor: '#d1c4e9', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', color: '#4a148c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={18} /> مدرس خصوصي
          </button>
          <button onClick={() => setShowTaskModal(true)} style={{ backgroundColor: '#f8ad9d', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> إضافة موعد
          </button>
        </div>
      </header>

      {/* بطاقات ملخصة */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <BookOpen color="#edafb8" size={28} />
          <h3 style={{ margin: '10px 0 5px 0', color: '#4a4e69' }}>{schedule.length} مواد</h3>
          <span style={{ color: '#a5a58d', fontSize: '14px' }}>المسجلة في الجدول</span>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <DollarSign color="#b39ddb" size={28} />
          <h3 style={{ margin: '10px 0 5px 0', color: '#4a4e69' }}>{tutors.length} دروس خصوصية</h3>
          <span style={{ color: '#a5a58d', fontSize: '14px' }}>متابعـة الأقسـاط</span>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <Calendar color="#b5e2fa" size={28} />
          <h3 style={{ margin: '10px 0 5px 0', color: '#4a4e69' }}>{tasks.filter(t => !t.completed).length} مهام</h3>
          <span style={{ color: '#a5a58d', fontSize: '14px' }}>اختبارات وتكليفات قادمة</span>
        </div>
      </div>

      {/* 1. جدول المحاضرات (مع إمكانية التعديل) */}
      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
        <h2 style={{ color: '#4a4e69', marginBottom: '20px', fontSize: '20px' }}>جدول الأسبوع</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#a5a58d' }}>
              <th style={{ padding: '12px' }}>اليوم</th>
              <th style={{ padding: '12px' }}>الوقت</th>
              <th style={{ padding: '12px' }}>المادة</th>
              <th style={{ padding: '12px' }}>الدكتور/ة</th>
              <th style={{ padding: '12px' }}>القاعة</th>
              <th style={{ padding: '12px' }}>خيارات</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#6c757d' }}>{item.day}</td>
                <td style={{ padding: '16px 12px', color: '#6c757d' }}>{item.time}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ backgroundColor: item.bg, color: item.text, padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                    {item.subject}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', color: '#495057' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} color="#adb5bd" /> {item.instructor || 'غير محدد'}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', color: '#6c757d' }}>{item.room || '-'}</td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Edit2 size={18} color="#4fc3f7" style={{ cursor: 'pointer' }} onClick={() => handleEditSubject(item)} />
                    <Trash2 size={18} color="#e57373" style={{ cursor: 'pointer' }} onClick={() => setSchedule(schedule.filter(s => s.id !== item.id))} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. قسم متابعة الدروس الخصوصية والمدفوعات */}
      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
        <h2 style={{ color: '#4a4e69', marginBottom: '20px', fontSize: '20px' }}>متابعة الدروس الخصوصية والأقساط 💰</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {tutors.length === 0 ? (
            <p style={{ color: '#a5a58d' }}>لا يوجد دروس خصوصية مسجلة.</p>
          ) : (
            tutors.map((tutor) => {
              const monthlyPrice = (tutor.totalAmount / tutor.monthsCount).toFixed(0);
              const isFullyPaid = tutor.paidMonths >= tutor.monthsCount;

              return (
                <div key={tutor.id} style={{ border: '1px solid #f0f0f0', borderRadius: '16px', padding: '20px', backgroundColor: isFullyPaid ? '#f1f8e9' : '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#4a4e69' }}>{tutor.subject}</h3>
                      <span style={{ fontSize: '13px', color: '#8d99ae' }}>المدرس: {tutor.tutorName || 'غير محدد'}</span>
                    </div>
                    <Trash2 size={18} color="#e57373" style={{ cursor: 'pointer' }} onClick={() => setTutors(tutors.filter(t => t.id !== tutor.id))} />
                  </div>

                  <div style={{ margin: '15px 0', fontSize: '14px', color: '#555' }}>
                    <div>الإجمالي: <strong>{tutor.totalAmount} ريال</strong> ({tutor.monthsCount} أشهر)</div>
                    <div>القسط الشهري: <strong>{monthlyPrice} ريال/شهر</strong></div>
                  </div>

                  {/* شريط تقدم الدفعات */}
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#777', marginBottom: '5px' }}>
                      <span>المدفوع: {tutor.paidMonths} من {tutor.monthsCount} أشهر</span>
                      <span>{Math.round((tutor.paidMonths / tutor.monthsCount) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${(tutor.paidMonths / tutor.monthsCount) * 100}%`, height: '100%', backgroundColor: isFullyPaid ? '#66bb6a' : '#ab47bc' }}></div>
                    </div>
                  </div>

                  {/* زر إضافة دفعة شهرية */}
                  {!isFullyPaid ? (
                    <button 
                      onClick={() => handlePayMonth(tutor.id)}
                      style={{ width: '100%', backgroundColor: '#e1bee7', border: 'none', padding: '8px', borderRadius: '10px', color: '#4a148c', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={16} /> تسجيل دفع قسط شهر ({monthlyPrice} ريال)
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', padding: '6px', backgroundColor: '#ded', borderRadius: '10px', fontSize: '14px' }}>
                      تم سداد كافة الدفعات بالكامل 
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. قسم الاختبارات والتكليفات */}
      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h2 style={{ color: '#4a4e69', marginBottom: '20px', fontSize: '20px' }}>مواعيد الاختبارات والتكليفات القادمة 🎯</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '14px', backgroundColor: task.completed ? '#f8f9fa' : '#fff5f5', borderRight: `5px solid ${task.type === 'اختبار' ? '#f8ad9d' : '#b5e2fa'}`, opacity: task.completed ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={22} color={task.completed ? '#66bb6a' : '#ccc'} style={{ cursor: 'pointer' }} onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))} />
                <div>
                  <h4 style={{ margin: 0, color: '#4a4e69', fontSize: '16px', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h4>
                  <span style={{ fontSize: '13px', color: '#8d99ae' }}>{task.subject ? `${task.subject} • ` : ''}التاريخ: {task.date}</span>
                </div>
              </div>
              <Trash2 size={18} color="#e57373" style={{ cursor: 'pointer' }} onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} />
            </div>
          ))}
        </div>
      </div>

      {/* نافذة إضافة / تعديل مادة */}
      {showSubjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#4a4e69' }}>{editingSubjectId ? 'تعديل المادة ✏️' : 'إضافة مادة جديدة 📝'}</h3>
              <X size={20} cursor="pointer" color="#a5a58d" onClick={() => setShowSubjectModal(false)} />
            </div>
            <form onSubmit={handleSaveSubject} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>اليوم</label>
                <select value={newSubject.day} onChange={(e) => setNewSubject({ ...newSubject, day: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                  <option value="الأحد">الأحد</option>
                  <option value="الإثنين">الإثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>اسم المادة</label>
                <input type="text" value={newSubject.subject} onChange={(e) => setNewSubject({ ...newSubject, subject: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>الوقت</label>
                <input type="text" value={newSubject.time} onChange={(e) => setNewSubject({ ...newSubject, time: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>اسم الدكتور/ة</label>
                <input type="text" value={newSubject.instructor} onChange={(e) => setNewSubject({ ...newSubject, instructor: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>القاعة</label>
                <input type="text" value={newSubject.room} onChange={(e) => setNewSubject({ ...newSubject, room: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#f8ad9d', border: 'none', padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>حفظ التغييرات</button>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة درس خصوصي */}
      {showTutorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#4a4e69' }}>إضافة درس خصوصي 💰</h3>
              <X size={20} cursor="pointer" color="#a5a58d" onClick={() => setShowTutorModal(false)} />
            </div>
            <form onSubmit={handleAddTutor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>المادة</label>
                <input type="text" placeholder="مثال: رياضيات معقدة" value={newTutor.subject} onChange={(e) => setNewTutor({ ...newTutor, subject: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>اسم المدرس الخصوصي</label>
                <input type="text" placeholder="مثال: أ. محمد" value={newTutor.tutorName} onChange={(e) => setNewTutor({ ...newTutor, tutorName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>السعر الإجمالي (ريال)</label>
                <input type="number" placeholder="مثال: 1200" value={newTutor.totalAmount} onChange={(e) => setNewTutor({ ...newTutor, totalAmount: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>عدد الأشهر (الدفعة)</label>
                <input type="number" placeholder="مثال: 3" value={newTutor.monthsCount} onChange={(e) => setNewTutor({ ...newTutor, monthsCount: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <button type="submit" style={{ backgroundColor: '#d1c4e9', border: 'none', padding: '12px', borderRadius: '10px', color: '#4a148c', fontWeight: 'bold', cursor: 'pointer' }}>حفظ المدرس</button>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة اختبار/تكليف */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#4a4e69' }}>إضافة موعد قادم 🎯</h3>
              <X size={20} cursor="pointer" color="#a5a58d" onClick={() => setShowTaskModal(false)} />
            </div>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>العنوان</label>
                <input type="text" placeholder="مثال: كويز الفصل الأول" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>المادة</label>
                <input type="text" placeholder="مثال: قواعد بيانات" value={newTask.subject} onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>النوع</label>
                <select value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
                  <option value="اختبار">اختبار</option>
                  <option value="واجب">واجب</option>
                  <option value="مشروع">مشروع</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6c757d' }}>التاريخ</label>
                <input type="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' }} required />
              </div>
              <button type="submit" style={{ backgroundColor: '#b5e2fa', border: 'none', padding: '12px', borderRadius: '10px', color: '#1d3557', fontWeight: 'bold', cursor: 'pointer' }}>حفظ الموعد</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;