using MvcSinglePage.ApplicationServices.Dtos.PersonDtos;
using MvcSinglePage.Models.DomainModels.PersonAggregates;

namespace MvcSinglePage.Models.Services.Contracts
{
    public interface IPersonRepository
    {
        Task Insert(Person person);
        Task Update(Person person);
        Task<Person> GetPersonById(GetPersonByIdDto getPersonByIdDto);
        Task Delete(Person person);
        Task<List<Person>> SelectAll();

    }
}
