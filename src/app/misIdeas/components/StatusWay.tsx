import { CheckCheckIcon, EyeIcon, SparkleIcon } from "lucide-react";

interface Status {
    status: string;
    icon: React.ReactNode;
}

const statusIcons: Status[] = [
    { status: "Enviado", icon: <CheckCheckIcon className="w-5 h-5" /> },
    { status: "En revisión", icon: <EyeIcon className="w-5 h-5" /> },
    { status: "Visto bueno", icon: <SparkleIcon className="w-5 h-5" /> },
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
    ${status.status === "Enviado" ? "text-green-500 scale-110"
                                    : status.status === "En revisión" ? "text-blue-500 scale-110"
                                        : status.status === "Visto bueno" ? "text-yellow-500 scale-110"
                                            : "text-gray-400"
                                }
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