"use client";

import CampaignAssistantWidget
  from "@/components/agreements/CampaignAssistantWidget";

type Task = {
  title: string;
  completed?: boolean;
  type?: string;

  agreementTitle?: string;
  agreementId?: string;
};

export default function GlobalCampaignAssistant({
  tasks,
}: {
  tasks: Task[];
}) {

  if (!tasks?.length) return null;

  return (
    <CampaignAssistantWidget
      tasks={tasks}
    />
  );
}