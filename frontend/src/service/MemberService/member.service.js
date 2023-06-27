import { useState } from "react";

import { axiosInstance } from "../../axiosInstance";

import { ApiRoutes } from "../../routes/apiRoutes";

export const MemberService = () => {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [member, setMember] = useState();

  const [memberLoading, setMemberLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(ApiRoutes.MEMBERS);

      setMembers(data);
    } catch (ex) {
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (member) => {
    try {
      setMemberLoading(true);

      const { data } = await axiosInstance.post(ApiRoutes.MEMBERS, { member });

      setMembers((members) => [...members, data]);

      setMember(data);

      return data;
    } catch (ex) {
    } finally {
      setMemberLoading(false);
    }
  };

  const updateMember = async (member) => {
    try {
      setMemberLoading(true);

      const { data } = await axiosInstance.put(
        `${ApiRoutes.MEMBERS}/${member?._id}`,
        { member }
      );

      setMembers((members) =>
        members?.map((existingMember) =>
          existingMember?._id === member?._id ? data : existingMember
        )
      );
      setMember(data);
      return data;
    } catch (ex) {
    } finally {
      setMemberLoading(false);
    }
  };

  const deleteMember = async (member) => {
    try {
      setMemberLoading(true);

      await axiosInstance.delete(`${ApiRoutes.MEMBERS}/${member?._id}`);

      setMembers((members) =>
        members?.filter((existingMember) => existingMember?._id !== member?._id)
      );
      setMember(undefined);
    } catch (ex) {
    } finally {
      setMemberLoading(false);
    }
  };

  const updateMembers = (member, type = "add") => {
    setMembers((members) =>
      type === "add"
        ? [...members, member]
        : members?.map((existingMember) =>
            existingMember?._id === member?._id ? member : existingMember
          )
    );
  };

  return {
    fetchMembers,
    loading,
    member,
    members,
    addMember,
    updateMember,
    updateMembers,
    deleteMember,
  };
};
