import React, { useState, useEffect } from 'react';
import './App.css';

interface Student {
  id: number;
  name: string;
  age: number;
  class: string;
  grade: string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    grade: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterAge, setFilterAge] = useState('');

  // Load data from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem('students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.class || !formData.grade) {
      alert('Please fill all fields');
      return;
    }

    if (editingId) {
      // Update existing student
      setStudents(students.map(student => 
        student.id === editingId 
          ? { ...formData, age: Number(formData.age), id: editingId }
          : student
      ));
      setEditingId(null);
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now(),
        name: formData.name,
        age: Number(formData.age),
        class: formData.class,
        grade: formData.grade
      };
      setStudents([...students, newStudent]);
    }

    // Reset form
    setFormData({ name: '', age: '', class: '', grade: '' });
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      age: student.age.toString(),
      class: student.class,
      grade: student.grade
    });
    setEditingId(student.id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', age: '', class: '', grade: '' });
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    const matchesAge = !filterAge || student.age.toString() === filterAge;
    
    return matchesSearch && matchesGrade && matchesAge;
  });

  return (
    <div className="app">
      <h1>Student Management Form-to-Table</h1>
      
      {/* Form Section */}
      <div className="form-section">
        <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Student Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div className="form-row">
            <select
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
            >
              <option value="">Select Class</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Other">Other</option>
              
            </select>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit">
              {editingId ? 'Update Student' : 'Add Student'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <h3>Search & Filter</h3>
        <div className="search-row">
          <input
            type="text"
            placeholder="Search by name or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
          <input
            type="number"
            placeholder="Filter by age"
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="table-section">
        <h3>Students List ({filteredStudents.length})</h3>
        {filteredStudents.length === 0 ? (
          <p className="no-students">No students found. Add some students!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                  <td>
                    <span className={`grade grade-${student.grade.replace('+', 'plus')}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(student)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;