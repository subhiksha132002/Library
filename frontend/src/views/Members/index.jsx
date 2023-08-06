import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Drawer, Space, Table, Modal, Tabs } from "antd";
import MemberForm from "./MemberForm";
import { MemberService } from "../../service/MemberService/member.service";
import generateColumns from "./columns";

import "./members.css";

export const Members = () => {
  const { members, loading, fetchMembers, updateMembers, deleteMember } =
    MemberService();

  const [isMemberFormOpen, setIsMemberFormVisible] = useState(false);

  const [chosenMember, setChosenMember] = useState();

  const openMemberForm = () => setIsMemberFormVisible(true);

  const closeMemberForm = () => {
    setIsMemberFormVisible(false);
    setChosenMember(undefined);
  };

  const handleSubmit = (member) => {
    closeMemberForm();
    updateMembers(member, chosenMember?._id ? "update" : "add");
  };

  const handleEdit = (member) => {
    setIsMemberFormVisible(true);
    setChosenMember(member);
  };

  const handleDelete = (member) => {
    if (!member) return;

    Modal.confirm({
      cancelText: "Cancel",
      centered: true,
      okText: "Delete",
      onOk: async () => deleteMember(member),
      title: `Are you sure. You want to delete ${member.name}?`,
      type: "confirm",
    });
  };

  const items = [
    {
      key: "1",
      label: "Students",
      children: (
        <Table
          rowKey="_id"
          columns={generateColumns(handleEdit, handleDelete)}
          loading={loading}
          dataSource={members?.filter((member) => member?.type === "student")}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Staff Details",
      children: (
        <Table
          rowKey="_id"
          columns={generateColumns(handleEdit, handleDelete)}
          loading={loading}
          dataSource={members?.filter((member) => member?.type === "staff")}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <>
      <div className="members">
        <Space className="members__header">
          <h1>Members</h1>
          <PlusCircleOutlined onClick={openMemberForm} />
        </Space>
        <Table
          rowKey="_id"
          columns={generateColumns(handleEdit, handleDelete)}
          loading={loading}
          dataSource={members?.filter((member) => member?.type === "staff")}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      </div>
      <Drawer
        destroyOnClose
        title={`${chosenMember?._id ? "Update" : "Add"} Member`}
        width={500}
        open={isMemberFormOpen}
        onClose={closeMemberForm}
      >
        <MemberForm
          member={chosenMember}
          onSubmit={handleSubmit}
          onCancel={closeMemberForm}
        />
      </Drawer>
    </>
  );
};
