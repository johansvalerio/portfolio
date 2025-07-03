import { CheckCheckIcon, EyeIcon, SparkleIcon } from "lucide-react";

interface Status {
    status: string;
    icon: React.ReactNode;
}

const statusIcons: Status[] = [
    { status: "Enviado", icon: <CheckCheckIcon className="w-5 h-5 text-amber-600 dark:text-amber-300" /> },
    { status: "En revisión", icon: <EyeIcon className="w-5 h-5 text-blue-600 dark:text-blue-500" /> },
    { status: "Visto bueno", icon: <SparkleIcon className="w-5 h-5 text-green-600 dark:text-green-500" /> },
];

export default function StatusWay() {
    return (

        <div className="flex flex-col">
            <h3 className="md:text-2xl text-xl font-bold mb-6">Así funciona la selección de ideas</h3>
            <div className="flex flex-col md:flex-row gap-6">
                {statusIcons.map((status, index) => (
                    <p key={index} className=" flex items-center gap-4 ">
                        <span
                            className={`transition-all duration-300 ease-in-out p-2 rounded-full bg-primary/10
  `}
                        >
                            {status.icon}
                        </span> {status.status}
                    </p>
                ))}
            </div>

        </div>

    )
}