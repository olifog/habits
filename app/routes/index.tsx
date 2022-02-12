import HabitDisplay from "~/components/habit";

export default function Index() {
  return (
    <div className="w-screen h-screen flex place-content-center">
      <div className="flex flex-wrap max-w-md my-auto justify-center">
        <HabitDisplay habit="No sugar" />
        <HabitDisplay habit="Meditate" />
        <HabitDisplay habit="Do Quizlet" />
        <HabitDisplay habit="Go on walk" />
        <HabitDisplay habit="Read" />
      </div>
    </div>
  );
}
