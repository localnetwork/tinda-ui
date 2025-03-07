interface SellerCenterBreadcrumbsProps {
  data: object;
}

import { useRouter } from "next/router";

export default function SellerCenterBreadcrumbs({
  data,
}: SellerCenterBreadcrumbsProps) {
  const router = useRouter();

  console.log("router", router?.asPath);
  console.log("data", data);
  return (
    <div>
      <div>
        <div className="flex gap-2 text-[14px] items-center">
          {router.asPath
            .split("/")
            .filter(Boolean)
            .map((path, index, array) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={index === array.length - 1 ? "text-primary" : ""}
                >
                  {path.charAt(0).toUpperCase() +
                    path.slice(1).replace(/-/g, " ")}
                </span>
                {index < array.length - 1 && <span>/</span>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
