const Header = (props) => {
  console.log(props);
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Content = ({ parts }) => {
  console.log(parts);
  return (
    <>
      {parts.map((part) => {
        return (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        );
      })}
    </>
  );
};

const Total = ({ parts }) => {
  console.log(parts);
  const total = parts.reduce((sum, part) => {
    console.log(sum);
    return sum + part.exercises;
  }, 0);
  return (
    <div>
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  );
};

const Part = (props) => {
  console.log(props);
  return (
    <>
      <p>
        {props.part} {props.exercises}
      </p>
    </>
  );
};

const Course = ({ courses }) => {
  console.log(courses);
  return (
    <>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        );
      })}
    </>
  );
};

export default Course;
