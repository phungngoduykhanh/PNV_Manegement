import React, { useState, useEffect } from 'react';
import axios from 'axios';

import classNames from 'classnames/bind';
import styles from './CreateClass.module.scss';
const cx = classNames.bind(styles);

function CreateClass() {
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [staffSearchTerm, setStaffSearchTerm] = useState('');
    const [teacherSearchResults, setTeacherSearchResults] = useState([]);
    const [staffSearchResults, setStaffSearchResults] = useState([]);
    const [studentSearchResults, setStudentSearchResults] = useState([]);
    const [selectedStaff, setSelectedStaffs] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isInputValid, setIsInputValid] = useState(false);


    const fetchUsers = async (term) => {
        try {
            const response = await axios.get(`http://localhost:3000/users?search=${term}`);
            return response.data.filter((user) =>
                user.email.toLowerCase().includes(term.toLowerCase())
            );
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    useEffect(() => {
        setTeacherSearchResults([]);
    }, [teacherSearchTerm]);

    useEffect(() => {
        setStaffSearchResults([]);
    }, [staffSearchTerm])

    useEffect(() => {
        setStudentSearchResults([]);
    }, [studentSearchTerm]);

    useEffect(() => {
        checkInputValidity();
    }, [selectedTeachers, selectedStaff, selectedStudents, teacherSearchTerm, staffSearchTerm, studentSearchTerm]);

    const checkInputValidity = () => {
        const classNameInput = document.getElementById('class-name-input');
        const isClassNameValid = classNameInput.value.trim() !== '';
        const isTeachersSelected = selectedTeachers.length > 0;
        const isStaffSelected = selectedStaff.length > 0;
        const isStudentsSelected = selectedStudents.length > 0;

        setIsInputValid(isClassNameValid && isTeachersSelected && isStaffSelected && isStudentsSelected);
    };


    const handleTeacherSearchTermChange = async (event) => {
        const term = event.target.value;
        setTeacherSearchTerm(term);

        try {
            const results = await fetchUsers(term);
            setTeacherSearchResults(
                results.filter(
                    (user) =>
                        !selectedTeachers.find((selectedUser) => selectedUser.id === user.id) &&
                        user.role === 'teacher'
                )
            );
        } catch (error) {
            console.error('Error searching teachers:', error);
            setTeacherSearchResults([]);
        }
    };

    const handleStaffSearchTermChange = async (event) => {
        const term = event.target.value;
        setStaffSearchTerm(term);

        try {
            const results = await fetchUsers(term);
            setStaffSearchResults(
                results.filter(
                    (user) =>
                        !selectedStaff.find((selectedUser) => selectedUser.id === user.id) &&
                        user.role === 'staff'
                )
            )
        } catch (error) {
            console.error("Error searching students:", error);
            setStaffSearchResults([]);
        }
    }

    const handleStudentSearchTermChange = async (event) => {
        const term = event.target.value;
        setStudentSearchTerm(term);

        try {
            const results = await fetchUsers(term);
            setStudentSearchResults(
                results.filter(
                    (user) =>
                        !selectedStudents.find((selectedUser) => selectedUser.id === user.id) &&
                        user.role === 'student'
                )
            );
        } catch (error) {
            console.error("Error searching students:", error);
            setStudentSearchResults([]);
        }
    };
    const handleUserSelect = (user, role) => {
        if (role === 'teacher') {
            setSelectedTeachers([...selectedTeachers, user]);
            setTeacherSearchTerm('');
        } else if (role === 'student') {
            setSelectedStudents([...selectedStudents, user]);
            setStudentSearchTerm('');
        } else {
            setSelectedStaffs([...selectedStaff, user]);
            setStaffSearchTerm('');
        }
    };

    const handleRemoveUser = (user, role) => {
        if (role === 'teacher') {
            const updatedTeachers = selectedTeachers.filter((teacher) => teacher.id !== user.id);
            setSelectedTeachers(updatedTeachers);
        } else if (role === 'student') {
            const updatedStudents = selectedStudents.filter((student) => student.id !== user.id);
            setSelectedStudents(updatedStudents);
        } else {
            const updatedStaffs = selectedStaff.filter((staff) => staff.id !== user.id);
            setSelectedStaffs(updatedStaffs);
        }
    };


    const handleCreateClass = async () => {
        const className = document.getElementById('class-name-input').value;

        if (!isInputValid) {
            alert('Please fill in all the required fields.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/classes');
            const existingClasses = response.data;

            // Find the maximum class_id among the existing classes
            const maxClassId = existingClasses.length > 0 ? Math.max(...existingClasses.map((cls) => Number(cls.class_id))) : 0;

            // Generate the new class_id by incrementing the maximum value
            const classId = maxClassId + 1;

            // Prepare the data for the new class
            const newClass = {
                class_id: classId,
                className: className,
                teacher_emails: selectedTeachers.map((teacher) => teacher.email),
                student_emails: selectedStudents.map((student) => student.email),
                staff_emails: selectedStaff.map((staff) => staff.email)
            };

            // Check if the className already exists
            const existingClass = existingClasses.find((cls) => cls.className === className);

            if (existingClass) {
                console.error('Class name already exists:', className);
                alert('Class name already exists. Please choose a different name.');
                window.location.href = 'http://localhost:3001/#open-modal';
                return;
            }

            // Send a POST request to create the new class
            const createResponse = await axios.post('http://localhost:3000/classes', newClass);
            console.log('Created class:', createResponse.data);

            // Reset the selected users state and any other relevant state
            setSelectedTeachers([]);
            setSelectedStudents([]);
            setSelectedStaffs([]);
            document.getElementById('class-name-input').value = '';
            setIsInputValid(false);
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };

    return (
        <div>
            <div className={cx("container-modal")}>
                <div className={cx("container__interior")}>
                    <a className={cx("btn")} href={cx("#open-modal")}>
                        <span>
                            <i className={cx("fa-solid fa-plus")} />
                        </span>
                        Add Chat
                    </a>
                </div>
            </div>
            <div id={cx("open-modal")} className={cx("modal-window")}>
                <div className={cx("modal-window__content")}>
                    <h1 className={cx("modal-window__title")}>Create Chat Room</h1>
                    <div className={cx("modal-window__input")}>
                        <input type="text" id="class-name-input"
                            placeholder="Chat Room name (required)" />
                    </div>
                    <div className={cx("modal-window__input")}>
                        <input
                            type="text"
                            placeholder="Add Teacher"
                            value={teacherSearchTerm}
                            onChange={handleTeacherSearchTermChange}
                        />
                        {teacherSearchTerm && teacherSearchResults.length > 0 && (
                            <ul className={cx("dropdown-menu")}>
                                {teacherSearchResults.map((user) => (
                                    <li key={user.id}>
                                        <button onClick={() => handleUserSelect(user, 'teacher')}>{user.email}</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className={cx('selected')}>
                            <ul className={cx('selected-results')}>
                                {selectedTeachers.map((teacher) => (
                                    <li className={cx('selected-results_email')} key={teacher.id}>
                                        <span>{teacher.email}</span>
                                        <button onClick={() => handleRemoveUser(teacher, 'teacher')}>X</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={cx("modal-window__input")}>
                        <input
                            type="text"
                            placeholder="Add Staff"
                            value={staffSearchTerm}
                            onChange={handleStaffSearchTermChange}
                        />
                        {staffSearchTerm && staffSearchResults.length > 0 && (
                            <ul className={cx("dropdown-menu")}>
                                {staffSearchResults.map((user) => (
                                    <li key={user.id}>
                                        <button onClick={() => handleUserSelect(user, 'staff')}>{user.email}</button>
                                    </li>
                                ))}
                            </ul>

                        )}
                        <div className={cx('selected')}>
                            <ul className={cx('selected-results')}>
                                {selectedStaff.map((staff) => (
                                    <li key={staff.id}>
                                        <span>{staff.email}
                                        </span>
                                        <button onClick={() => handleRemoveUser(staff, 'staff')}>X</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className={cx("modal-window__input")}>
                        <input
                            type="text"
                            placeholder="Add Student"
                            value={studentSearchTerm}
                            onChange={handleStudentSearchTermChange}
                        />
                        {studentSearchTerm && studentSearchResults.length > 0 && (
                            <ul className={cx("dropdown-menu")}>
                                {studentSearchResults.map((user) => (
                                    <li key={user.id}>
                                        <button onClick={() => handleUserSelect(user, 'student')}>{user.email}</button>
                                    </li>
                                ))}
                            </ul>

                        )}
                        <div className={cx('selected')}>
                            <ul className={cx('selected-results')}>
                                {selectedStudents.map((student) => (
                                    <li key={student.id}>
                                        <span>{student.email}
                                        </span>
                                        <button onClick={() => handleRemoveUser(student, 'student')}>X</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className={cx("modal-window__button")}>
                        <a href='#' className={cx("modal-window__close")}>
                            Cancel
                        </a>
       
                        <a
                            className={cx("modal-window__create")}
                            style={{
                                backgroundColor: isInputValid ? "rgba(53, 166, 242, 1)" : "",
                                color: isInputValid ? "white" : ""
                            }}
                            onClick={handleCreateClass}
                        >
                            Create
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
}


export default CreateClass;