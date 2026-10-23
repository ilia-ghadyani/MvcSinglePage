using MvcSinglePage.ApplicationServices.Dtos.PersonDtos;

namespace MvcSinglePage.ApplicationServices.Contracts
{
    public interface IPersonApplicationService
    {
        Task<List<GetPersonDto>> GetAllPerson();
        Task Post(PostPersonDto postPersonDto);
        Task Put(PutPersonDto putPersonDto);
        Task Delete(DeletePersonDto deletePersonDto);
    }
}
