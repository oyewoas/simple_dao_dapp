import { useDaoActions } from "../providers/DaoActionsContext";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type DaoEventLog = {
  address: string;
  blockNumber: bigint;
  eventName: string;
  transactionHash: string;
  args?: Record<string, string | bigint>;
};

type DaoEvent = {
  type: string;
  logs: DaoEventLog;
};

  const DaoEvents = () => {
    const { events } = useDaoActions() as { events: DaoEvent[] };
    const lastEventCount = useRef(0);
  
    useEffect(() => {
      if (events.length > lastEventCount.current) {
        const newEvents = events.slice(lastEventCount.current);
        newEvents.forEach(ev => {
          toast.success(
            <div>
              <div className="font-bold">{ev.type}</div>
              <div className="text-xs">Tx: {ev?.logs?.transactionHash?.slice(0, 10)}... Block: {ev?.logs?.blockNumber?.toString()}</div>
            </div>,
            { duration: 5000 }
          );
        });
        lastEventCount.current = events.length;
      }
    }, [events]);
  
    return null;
  };
  
  export default DaoEvents;

