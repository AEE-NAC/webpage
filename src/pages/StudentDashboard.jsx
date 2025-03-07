import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Book, Calendar, User, Award, Bell, LogOut, Menu, X, Home, Settings, HelpCircle } from 'react-feather';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedInfo = localStorage.getItem('student_info');
    if (!storedInfo) {
      navigate('/student-registration');
      return;
    }

    setStudentInfo(JSON.parse(storedInfo));
    fetchCourses();
    fetchNotifications();
    fetchEnrolledCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch available courses from API
      const { data, error } = await api.from('courses')
        .select('*')
        .eq('active', true)
        .get();

      if (error) throw error;
      setCourses(data || availableCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(availableCourses);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // This would normally fetch from your database
      // For now, we'll use dummy data
      setNotifications([
        { id: 1, title: 'Nouvelle formation disponible', message: 'Une nouvelle formation sur l\'évangélisation des enfants est maintenant disponible.', date: '2023-05-15' },
        { id: 2, title: 'Rappel: Session en ligne', message: 'N\'oubliez pas la session en ligne demain à 18h00.', date: '2023-05-14' },
        { id: 3, title: 'Mise à jour du matériel de cours', message: 'Le matériel du cours "Fondements bibliques" a été mis à jour.', date: '2023-05-10' },
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!studentInfo) return;
    
    try {
      // This would fetch the student's enrolled courses
      // For now, we'll use dummy data
      setEnrolledCourses([
        { id: 1, title: 'Fondements bibliques', progress: 60, nextLesson: 'La création', dueDate: '2023-05-20' },
        { id: 2, title: 'Techniques d\'enseignement', progress: 30, nextLesson: 'Engager les enfants', dueDate: '2023-05-18' },
      ]);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const enrollInCourse = async (courseId) => {
    if (!studentInfo) return;
    
    try {
      // This would enroll the student in the course
      // For now, we'll just show an alert
      alert(`Inscription réussie au cours #${courseId}`);
      
      // In a real app, you would do something like:
      // await api.from('enrollments').insert([{
      //   student_id: studentInfo.id,
      //   course_id: courseId,
      //   enrolled_at: new Date()
      // }]);
      
      // Then refresh the enrolled courses
      fetchEnrolledCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_info');
    navigate('/student-registration');
  };

  // Dummy course data for demonstration
  const availableCourses = [
    {
      id: 1,
      title: 'Fondements bibliques pour l\'enseignement aux enfants',
      description: 'Ce cours couvre les principes bibliques fondamentaux pour enseigner efficacement aux enfants.',
      duration: '8 semaines',
      startDate: '2023-06-01',
      instructor: 'Pasteur Jean Dupont',
      image: '/images/course1.jpg'
    },
    {
      id: 2,
      title: 'Techniques d\'enseignement créatives',
      description: 'Apprenez des méthodes créatives pour engager les enfants dans l\'apprentissage biblique.',
      duration: '6 semaines',
      startDate: '2023-06-15',
      instructor: 'Marie Lambert',
      image: '/images/course2.jpg'
    },
    {
      id: 3,
      title: 'Leadership dans le ministère des enfants',
      description: 'Développez vos compétences en leadership pour diriger efficacement un ministère d\'enfants.',
      duration: '10 semaines',
      startDate: '2023-07-01',
      instructor: 'Dr. Paul Martin',
      image: '/images/course3.jpg'
    },
    {
      id: 4,
      title: 'Évangélisation des enfants',
      description: 'Stratégies et méthodes pour partager l\'évangile avec les enfants de manière adaptée à leur âge.',
      duration: '4 semaines',
      startDate: '2023-06-10',
      instructor: 'Sophie Tremblay',
      image: '/images/course4.jpg'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-[#981a3c] text-white h-full fixed lg:static w-64 transition-all duration-300 z-40 ${sidebarOpen ? 'left-0' : '-left-64'}`}>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="ml-1 w-full font-bold text-lg flex whitespace-nowrap">Espace Etudiant</span>
          </div>
          <button 
            className="lg:hidden text-white" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-8">
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white text-[#981a3c] flex items-center justify-center font-bold">
                {studentInfo?.firstName?.charAt(0)}{studentInfo?.lastName?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{studentInfo?.firstName} {studentInfo?.lastName}</p>
                <p className="text-xs opacity-70">{studentInfo?.email}</p>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2 px-2">
            <li>
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'courses' ? 'bg-white text-[#981a3c] font-medium' : 'hover:bg-[#7a1531] text-white'}`}
                onClick={() => setActiveTab('courses')}
              >
                <Book size={18} className="mr-3" />
                Formations disponibles
              </button>
            </li>
            <li>
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'my-courses' ? 'bg-white text-[#981a3c] font-medium' : 'hover:bg-[#7a1531] text-[#7a1531]'}`}
                onClick={() => setActiveTab('my-courses')}
              >
                <Calendar size={18} className="mr-3" />
                Mes formations
              </button>
            </li>
            <li>
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-white text-[#981a3c] font-medium' : 'hover:bg-[#7a1531] text-[#7a1531]'}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} className="mr-3" />
                Mon profil
              </button>
            </li>
            <li>
              <button 
                className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'notifications' ? 'bg-white text-[#981a3c] font-medium' : 'hover:bg-[#7a1531] text-[#7a1531]'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                Notifications
                <span className="ml-auto bg-white text-[#981a3c] text-xs rounded-full px-2 py-1">{notifications.length}</span>
              </button>
            </li>
          </ul>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-[200px] px-4 py-2 rounded-lg hover:bg-[#7a1531] text-[#7a1531]"
            >
              <LogOut size={18} className="mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Header */}
        <header className="bg-white shadow-sm z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="lg:hidden text-gray-600" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 text-gray-600 hover:text-[#981a3c] rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-[#981a3c] rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#981a3c] text-white flex items-center justify-center font-bold text-sm">
                  {studentInfo?.firstName?.charAt(0)}{studentInfo?.lastName?.charAt(0)}
                </div>
                <span className="ml-2 text-sm font-medium hidden md:block">{studentInfo?.firstName} {studentInfo?.lastName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Available Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Formations disponibles</h2>
              {loading ? (
                <div className="text-center py-8">Chargement des formations...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.map(course => (
                    <div key={course.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                          <div>Durée: {course.duration}</div>
                          <div>Début: {course.startDate}</div>
                        </div>
                        <div className="text-sm mb-4">
                          <span className="font-medium">Formateur:</span> {course.instructor}
                        </div>
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="w-full bg-[#981a3c] text-white py-2 rounded hover:bg-[#7a1531] transition-colors"
                        >
                          S'inscrire à cette formation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'my-courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mes formations</h2>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Vous n'êtes inscrit à aucune formation pour le moment.</p>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="mt-4 bg-[#981a3c] text-white px-4 py-2 rounded hover:bg-[#7a1531]"
                  >
                    Parcourir les formations disponibles
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {enrolledCourses.map(course => (
                    <div key={course.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{course.title}</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">En cours</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-2">Description:</p>
                        <p className="text-gray-800">{course.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Durée: {course.duration}</span>
                        <span className="mx-2">|</span>
                        <span>Début: {course.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mon profil</h2>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    value={studentInfo?.firstName || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, firstName: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    value={studentInfo?.lastName || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, lastName: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={studentInfo?.email || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={studentInfo?.phone || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, phone: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                  <input
                    type="text"
                    id="address"
                    value={studentInfo?.address || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, address: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    id="city"
                    value={studentInfo?.city || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, city: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
                  <input
                    type="text"
                    id="country"
                    value={studentInfo?.country || ''}
                    onChange={(e) => setStudentInfo({...studentInfo, country: e.target.value})}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-[#981a3c] text-white px-4 py-2 rounded hover:bg-[#7a1531]"
                >
                  Mettre à jour le profil
                </button>
              </div>
            </div>
          )}
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Notifications</h2>
              {notifications.length === 0? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Vous n'avez aucune nouvelle notification pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {notifications.map(notification => (
                    <div key={notification.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{notification.title}</h3>
                        <span className="text-sm text-gray-500">{notification.timestamp}</span>
                      </div>
                      <p className="text-gray-800">{notification.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default StudentDashboard;
