import Image from "next/image";
interface Props {
  title: string;
  value: string;
  iconSrc: string;
}

const PriceInfo = ({ title, value, iconSrc }: Props) => {
  return (
    <div className={"price-info_card border-[#ededed]"}>
      <p className="text-base text-[13px] text-black-100">{title}</p>

      <div className="flex gap-1">
        <Image src={iconSrc} alt="title" width={20} height={20} />
        <p className="text-[14px] font-bold text-seconday">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfo;
